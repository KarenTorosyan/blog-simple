package blog.entities.post.out;

import blog.entities.post.PostReaction;
import blog.entities.post.PostReactionDetails;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostReactionRepository {

    Mono<Void> save(PostReaction postReaction);

    Mono<PostReaction> findByPostIdAndSubject(String postId, String subject);

    Flux<PostReactionDetails> findAllByPostId(String postId);

    Mono<Boolean> existsByPostIdAndSubject(String postId, String subject);

    Mono<Void> deleteByPostIdAndSubject(String postId, String subject);
}
