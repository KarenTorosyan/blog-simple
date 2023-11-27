package blog.entities.post;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostReactionService {

    Mono<Void> setReaction(PostReaction postReaction);

    Mono<PostReaction> getReactionOfSubject(String postId, String subject);

    Flux<PostReactionDetails> getReactionDetails(String postId);

    Mono<Boolean> hasAnyReaction(String postId, String subject);

    Mono<Void> deleteReaction(String postId, String subject);
}
