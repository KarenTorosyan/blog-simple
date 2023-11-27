package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostCommentReaction;
import blog.entities.post.PostCommentReactionDetails;
import blog.entities.post.out.PostCommentReactionRepository;
import blog.utils.Convertor;
import lombok.RequiredArgsConstructor;
import org.springframework.r2dbc.core.DatabaseClient;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

@Repository
@RequiredArgsConstructor
public class R2dcPostCommentReactionRepository implements PostCommentReactionRepository {

    private final DatabaseClient databaseClient;

    @Override
    public Mono<Void> save(PostCommentReaction postCommentReaction) {
        return databaseClient.sql("insert into post_comment_reactions (post_comment_id, subject, reaction) " +
                        "values (:postCommentId, :subject, :reaction)")
                .bind("postCommentId", Convertor.idAsNumberLong(postCommentReaction.getPostCommentId()))
                .bind("subject", postCommentReaction.getSubject())
                .bind("reaction", postCommentReaction.getReaction())
                .then();
    }

    @Override
    public Mono<PostCommentReaction> findByPostCommentIdAndSubject(String postCommentId, String subject) {
        return databaseClient.sql("select post_comment_id, subject, reaction from post_comment_reactions " +
                        "where post_comment_id = :postCommentId and subject = :subject")
                .bind("postCommentId", Convertor.idAsNumberLong(postCommentId))
                .bind("subject", subject)
                .map(PostCommentReactionRowMapper::map)
                .one();
    }

    @Override
    public Flux<PostCommentReaction> findByPostCommentIdAndSubject(Set<String> postCommentIds, String subject) {
        return databaseClient.sql("select post_comment_id, subject, reaction from post_comment_reactions " +
                " where post_comment_id in (:postCommentIds) and subject = :subject")
                .bind("postCommentIds", postCommentIds.stream().map(Convertor::idAsNumberLong).toList())
                .bind("subject", subject)
                .map(PostCommentReactionRowMapper::map)
                .all();
    }

    @Override
    public Flux<PostCommentReactionDetails> findAllByPostCommentId(String postCommentId) {
        return databaseClient.sql("select post_comment_id, reaction, count(reaction) as reaction_count from post_comment_reactions " +
                        "where post_comment_id = :postCommentId group by post_comment_id, reaction")
                .bind("postCommentId", Convertor.idAsNumberLong(postCommentId))
                .map(PostCommentReactionDetailsRowMapper::map)
                .all();
    }

    @Override
    public Flux<PostCommentReactionDetails> findAllByPostCommentId(Set<String> postCommentIds) {
        return databaseClient.sql("select post_comment_id, reaction, count(reaction) as reaction_count from post_comment_reactions " +
                        "where post_comment_id in(:postCommentIds) group by post_comment_id, reaction")
                .bind("postCommentIds", postCommentIds.stream().map(Convertor::idAsNumberLong).toList())
                .map(PostCommentReactionDetailsRowMapper::map)
                .all();
    }

    @Override
    public Mono<Boolean> existsByPostCommentIdAndSubject(String postCommentId, String subject) {
        return databaseClient.sql("select exists(select post_comment_id from post_comment_reactions " +
                        "where post_comment_id = :postCommentId and subject = :subject)")
                .bind("postCommentId", Convertor.idAsNumberLong(postCommentId))
                .bind("subject", subject)
                .map(row -> row.get(0, Boolean.class))
                .one();
    }

    @Override
    public Mono<Void> deleteByPostCommentIdAndSubject(String postCommentId, String subject) {
        return databaseClient.sql("delete from post_comment_reactions where post_comment_id = :postCommentId " +
                        "and subject = :subject")
                .bind("postCommentId", Convertor.idAsNumberLong(postCommentId))
                .bind("subject", subject)
                .then();
    }
}
