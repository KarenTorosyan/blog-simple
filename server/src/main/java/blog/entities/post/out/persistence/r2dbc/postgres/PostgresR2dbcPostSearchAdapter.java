package blog.entities.post.out.persistence.r2dbc.postgres;

import blog.config.db.ConditionalOnDataSearchAdapterPostgres;
import blog.entities.post.Post;
import blog.entities.post.out.PostSearchAdapter;
import blog.entities.post.out.persistence.r2dbc.PostRowMapper;
import blog.utils.Convertor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

@ConditionalOnDataSearchAdapterPostgres
@Repository
@RequiredArgsConstructor
public class PostgresR2dbcPostSearchAdapter implements PostSearchAdapter {

    private final DatabaseClient databaseClient;

    @SuppressWarnings("all")
    @Override
    public Mono<Page<Post>> search(String term, Pageable pageable) {
        String query = "select id, author, content, preview_content, " +
                "created_date, created_by, updated_date, updated_by, " +
                "ts_rank(ts, query, 2) as rank " +
                "from posts, websearch_to_tsquery('english', :term) as query " +
                "where query @@ ts $order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by rank desc");
        }
        return databaseClient.sql(query)
                .bind("term", term)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostRowMapper::map)
                .all()
                .collectList().zipWhen(posts -> countBySearchTerm(term))
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    @SuppressWarnings("all")
    @Override
    public Mono<Page<Post>> searchByAuthor(String author, String term, Pageable pageable) {
        String query = "select id, author, content, preview_content, " +
                "created_date, created_by, updated_date, updated_by, " +
                "ts_rank(ts, query, 2) as rank " +
                "from posts, websearch_to_tsquery('english', :term) as query " +
                "where author = :author and query @@ ts $order limit :limit offset :offset";
        String order = Convertor.toString(pageable.getSort()); // safe
        if (!order.isBlank()) {
            query = query.replace("$order", "order by " + order);
        } else {
            query = query.replace("$order", "order by rank desc");
        }
        return databaseClient.sql(query)
                .bind("author", author)
                .bind("term", term)
                .bind("limit", pageable.getPageSize())
                .bind("offset", pageable.getOffset())
                .map(PostRowMapper::map)
                .all()
                .collectList().zipWhen(posts -> countBySearchTerm(term))
                .map(o -> new PageImpl<>(o.getT1(), pageable, o.getT2()));
    }

    public Mono<Long> countBySearchTerm(String term) {
        return databaseClient.sql("select count(id) from posts where ts @@ websearch_to_tsquery(:term)")
                .bind("term", term)
                .map(r -> r.get(0, Long.class))
                .one();
    }
}
