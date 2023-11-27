package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.Post;
import blog.entities.post.out.PostRepository;
import blog.entities.post.out.PostSearchAdapter;
import blog.errors.Errors;
import blog.utils.Convertor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.r2dbc.BadSqlGrammarException;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class R2dbcPostRepository implements PostRepository {

    private final DatabaseClient databaseClient;

    private final PostSearchAdapter postSearchAdapter;

    @Override
    public Mono<Post> save(Post post) {
        DatabaseClient.GenericExecuteSpec spec = post.getId() == null ?
                insert(post) : update(post);
        return spec.filter(statement -> statement.returnGeneratedValues(
                "id", "author", "content", "preview_content",
                        "created_date", "created_by", "updated_date", "updated_by"))
                .map(PostRowMapper::map)
                .one();
    }

    private DatabaseClient.GenericExecuteSpec insert(Post post) {
        return databaseClient.sql("insert into posts (author, content, preview_content, " +
                        "created_date, created_by) " +
                        "values (:author, :content, :previewContent, :createdDate, :createdBy)")
                .bind("author", post.getAuthor())
                .bind("content", post.getContent())
                .bind("previewContent", post.getPreviewContent())
                .bind("createdDate", post.getAudit().getCreatedDate())
                .bind("createdBy", post.getAudit().getCreatedBy());
    }

    private DatabaseClient.GenericExecuteSpec update(Post post) {
        return databaseClient.sql("update posts set content = :content, " +
                        "preview_content = :previewContent, " +
                        "updated_date = :updatedDate, updated_by = :updatedBy " +
                        "where id = :id")
                .bind("id", Convertor.idAsNumberLong(post.getId()))
                .bind("content", post.getContent())
                .bind("previewContent", post.getPreviewContent())
                .bind("updatedDate", post.getAudit().getUpdatedDate())
                .bind("updatedBy", post.getAudit().getUpdatedBy());
    }

    @Override
    public Mono<Void> deleteById(String id) {
        return databaseClient.sql("delete from posts where id = :id")
                .bind("id", Convertor.idAsNumberLong(id))
                .then();
    }

    @Override
    public Mono<Post> findById(String id) {
        return databaseClient.sql("select id, author, content, preview_content, " +
                        "created_date, created_by, updated_date, updated_by " +
                        "from posts where id = :id")
                .bind("id", Convertor.idAsNumberLong(id))
                .map(PostRowMapper::map)
                .one();
    }

    @Override
    public Mono<Boolean> existsById(String id) {
        return databaseClient.sql("select exists(select id from posts where id = :id)")
                .bind("id", Convertor.idAsNumberLong(id))
                .map(row -> row.get(0, Boolean.class))
                .one();
    }

    @SuppressWarnings("all")
    @Override
    public Mono<Page<Post>> findAll(Pageable pageable) {
        String query = "select id, author, content, preview_content, " +
                "created_date, created_by, updated_date, updated_by " +
                "from posts $order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by created_date desc");
        }
        return databaseClient.sql(query)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostRowMapper::map)
                .all()
                .onErrorMap(BadSqlGrammarException.class, e -> {
                    if (!order.isBlank()) {
                        return Errors.illegalSortParam(pageable.getSort().stream().toList().toString());
                    } else return e;
                })
                .collectList().zipWhen(posts -> count())
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    @SuppressWarnings("all")
    @Override
    public Mono<Page<Post>> findAllByAuthor(String author, Pageable pageable) {
        String query = "select id, author, content, preview_content, " +
                "created_date, created_by, updated_date, updated_by " +
                "from posts where author = :author $order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by created_date desc");
        }
        return databaseClient.sql(query)
                .bind("author", author)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostRowMapper::map)
                .all()
                .onErrorMap(BadSqlGrammarException.class, e -> {
                    if (!order.isBlank()) {
                        return Errors.illegalSortParam(pageable.getSort().stream().toList().toString());
                    } else return e;
                })
                .collectList()
                .zipWhen(posts -> countByAuthor(author))
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    @Override
    public Mono<Page<Post>> search(String term, Pageable pageable) {
        return postSearchAdapter.search(term, pageable);
    }

    @Override
    public Mono<Page<Post>> searchByAuthor(String author, String term, Pageable pageable) {
        return postSearchAdapter.searchByAuthor(author, term, pageable);
    }

    @Override
    public Mono<Long> count() {
        return databaseClient.sql("select count(id) from posts")
                .map(row -> row.get(0, Long.class))
                .one();
    }

    @Override
    public Mono<Long> countByAuthor(String author) {
        return databaseClient.sql("select count(id) from posts where author = :author")
                .bind("author", author)
                .map(row -> row.get(0, Long.class))
                .one();
    }
}
