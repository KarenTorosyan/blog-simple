package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostReaction;
import blog.entities.post.PostReactionDetails;
import blog.entities.post.out.PostReactionRepository;
import blog.utils.Convertor;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Repository
@RequiredArgsConstructor
public class R2dbcPostReactionRepository implements PostReactionRepository {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<Void> save(PostReaction postReaction) {
        return databaseClient.sql("insert into post_reactions (post_id, subject, reaction) " +
                        "values (:postId, :subject, :reaction)")
                .bind("postId", Convertor.idAsNumberLong(postReaction.getPostId()))
                .bind("subject", postReaction.getSubject())
                .bind("reaction", postReaction.getReaction())
                .then();
    }

    @Override
    public Mono<PostReaction> findByPostIdAndSubject(String postId, String subject) {
        return databaseClient.sql("select post_id, subject, reaction from post_reactions " +
                        "where post_id = :postId and subject = :subject")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .bind("subject", subject)
                .map(PostReactionRowMapper::map)
                .one();
    }

    @Override
    public Flux<PostReactionDetails> findAllByPostId(String postId) {
        return databaseClient.sql("select post_id, reaction, count(reaction) as reaction_count " +
                        "from post_reactions where post_id = :postId group by post_id, reaction")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .map(PostReactionDetailsRowMapper::map)
                .all();
    }

    @Override
    public Mono<Boolean> existsByPostIdAndSubject(String postId, String subject) {
        return databaseClient.sql("select exists(select post_id from post_reactions " +
                        "where post_id = :postId and subject = :subject)")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .bind("subject", subject)
                .map(row -> row.get(0, Boolean.class))
                .one();
    }

    @Override
    public Mono<Void> deleteByPostIdAndSubject(String postId, String subject) {
        return databaseClient.sql("delete from post_reactions where post_id = :postId and subject = :subject")
                .bind("postId", Convertor.idAsNumberLong(postId))
                .bind("subject", subject)
                .then();
    }
}
