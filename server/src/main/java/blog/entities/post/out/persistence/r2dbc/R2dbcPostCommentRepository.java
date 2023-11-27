package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostComment;
import blog.entities.post.out.PostCommentRepository;
import blog.errors.Errors;
import blog.utils.Convertor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.r2dbc.BadSqlGrammarException;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class R2dbcPostCommentRepository implements PostCommentRepository {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<PostComment> save(PostComment comment) {
        DatabaseClient.GenericExecuteSpec spec = comment.getId() == null ?
                insert(comment) : update(comment);
        return spec.filter(statement -> statement.returnGeneratedValues(
                        "id", "post_id", "subject", "parent_id", "content",
                        "created_date", "created_by", "updated_date", "updated_by"))
                .map(PostCommentRowMapper::map)
                .one();
    }

    private DatabaseClient.GenericExecuteSpec insert(PostComment comment) {
        DatabaseClient.GenericExecuteSpec spec = databaseClient.sql(
                        "insert into post_comments(post_id, subject, parent_id, content, " +
                                "created_date, created_by) " +
                                "values (:postId, :subject, :parentId, :content, :createdDate, :createdBy)")
                .bind("postId", Convertor.idAsNumberLong(comment.getPostId()))
                .bind("subject", comment.getSubject())
                .bindNull("parentId", Long.class)
                .bind("content", comment.getContent())
                .bind("createdDate", comment.getAudit().getCreatedDate())
                .bind("createdBy", comment.getAudit().getCreatedBy());
        if (comment.getParentId() != null) {
            spec = spec.bind("parentId", Convertor.idAsNumberLong(comment.getParentId()));
        }
        return spec;
    }

    private DatabaseClient.GenericExecuteSpec update(PostComment postComment) {
        return databaseClient.sql("update post_comments set content = :content, " +
                        "updated_date = :updatedDate, updated_by = :updatedBy " +
                        "where id = :id and post_id = :postId")
                .bind("id", Convertor.idAsNumberLong(postComment.getId()))
                .bind("postId", Convertor.idAsNumberLong(postComment.getPostId()))
                .bind("content", postComment.getContent())
                .bind("updatedDate", postComment.getAudit().getUpdatedDate())
                .bind("updatedBy", postComment.getAudit().getUpdatedBy());
    }

    @Override
    public Mono<Void> delete(String commentId, String postId) {
        return databaseClient.sql("delete from post_comments " +
                        "where id = :id and post_id = :postId")
                .bind("id", Convertor.idAsNumberLong(commentId))
                .bind("postId", Convertor.idAsNumberLong(postId))
                .then();
    }

    @Override
    public Mono<Boolean> exists(String commentId, String postId) {
        return databaseClient.sql("select exists(select id from post_comments " +
                        "where id = :id and post_id = :postId)")
                .bind("id", Convertor.idAsNumberLong(commentId))
                .bind("postId", Convertor.idAsNumberLong(postId))
                .map(row -> row.get(0, Boolean.class))
                .one();
    }

    @Override
    public Mono<PostComment> findById(String id) {
        return databaseClient.sql("select id, post_id, subject, parent_id, content, " +
                        "created_date, created_by, updated_date, updated_by " +
                        "from post_comments where id = :id")
                .bind("id", Convertor.idAsNumberLong(id))
                .map(PostCommentRowMapper::map)
                .one();
    }

    @Override
    public Mono<Boolean> existsById(String id) {
        return databaseClient.sql("select exists(select id from post_comments where id = :id)")
                .bind("id", Convertor.idAsNumberLong(id))
                .map(row -> row.get(0, Boolean.class))
                .one();
    }

    @Override
    public Mono<PostComment> find(String commentId, String postId) {
        return databaseClient.sql("select id, post_id, subject, parent_id, content, " +
                        "created_date, created_by, updated_date, updated_by " +
                        "from post_comments where id = :id and post_id = :postId")
                .bind("id", Convertor.idAsNumberLong(commentId))
                .bind("postId", Convertor.idAsNumberLong(postId))
                .map(PostCommentRowMapper::map)
                .one();
    }

    @SuppressWarnings("all")
    @Override
    public Mono<Page<PostComment>> findAllByParentIdIsNull(String postId, Pageable pageable) {
        String query = "select id, post_id, subject, parent_id, content, " +
                "created_date, created_by, updated_date, updated_by " +
                "from post_comments where post_id = :postId and parent_id is null " +
                "$order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by created_date desc");
        }
        return databaseClient.sql(query)
                .bind("postId", Convertor.idAsNumberLong(postId))
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostCommentRowMapper::map)
                .all()
                .onErrorMap(BadSqlGrammarException.class, e -> {
                    if (!order.isBlank()) {
                        return Errors.illegalSortParam(pageable.getSort().stream().toList().toString());
                    } else return e;
                })
                .collectList()
                .zipWhen(postComments -> countByPostIdAndParentIdIsNull(postId))
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    @Override
    public Flux<PostComment> findAllByParentId(String parentId) {
        return databaseClient.sql("select id, parent_id, post_id, content, subject, " +
                        "created_date, created_by, updated_date, updated_by " +
                        "from post_comments where parent_id = :parentId")
                .bind("parentId", Convertor.idAsNumberLong(parentId))
                .map(PostCommentRowMapper::map)
                .all();
    }

    @SuppressWarnings("all")
    @Override
    public Mono<Page<PostComment>> findAllBySubject(String subject, Pageable pageable) {
        String query = "select id, post_id, subject, parent_id, content, " +
                "created_date, created_by, updated_date, updated_by " +
                "from post_comments where subject = :subject $order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by created_date desc");
        }
        return databaseClient.sql(query)
                .bind("subject", subject)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostCommentRowMapper::map)
                .all()
                .onErrorMap(BadSqlGrammarException.class, e -> {
                    if (!order.isBlank()) {
                        return Errors.illegalSortParam(pageable.getSort().stream().toList().toString());
                    } else return e;
                })
                .collectList()
                .zipWhen(postComments -> countBySubject(subject))
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    @Override
    public Mono<Long> countByPostId(String postId) {
        return databaseClient.sql("select count(id) from post_comments where post_id = :postId")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .map(row -> row.get(0, Long.class))
                .one();
    }

    @Override
    public Mono<Long> countByPostIdAndParentIdIsNull(String postId) {
        return databaseClient.sql("select count(id) from post_comments where post_id = :postId and parent_id is null")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .map(row -> row.get(0, Long.class))
                .one();
    }

    @Override
    public Mono<Long> countBySubject(String subject) {
        return databaseClient.sql("select count(id) from post_comments where subject = :subject")
                .bind("subject", subject)
                .map(row -> row.get(0, Long.class))
                .one();
    }
}
