package blog.entities.post.out;

import blog.entities.post.PostCommentReaction;
import blog.entities.post.PostCommentReactionDetails;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

public interface PostCommentReactionRepository {

    Mono<Void> save(PostCommentReaction postCommentReaction);

    Mono<PostCommentReaction> findByPostCommentIdAndSubject(String postCommentId, String subject);

    Flux<PostCommentReaction> findByPostCommentIdAndSubject(Set<String> postCommentIds, String subject);

    Flux<PostCommentReactionDetails> findAllByPostCommentId(String postCommentId);

    Flux<PostCommentReactionDetails> findAllByPostCommentId(Set<String> postCommentIds);

    Mono<Boolean> existsByPostCommentIdAndSubject(String postCommentId, String subject);

    Mono<Void> deleteByPostCommentIdAndSubject(String postCommentId, String subject);
}
