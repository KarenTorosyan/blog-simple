package blog.entities.post;

import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

public interface PostCommentReactionService {

    Mono<Void> setReaction(PostCommentReaction postCommentReaction);

    Mono<PostCommentReaction> getReaction(String postCommentId, String subject);

    Flux<PostCommentReaction> getReactions(Set<String> postCommentIds, String subject);

    Flux<PostCommentReactionDetails> getReactionDetails(String postCommentId);

    Flux<PostCommentReactionDetails> getReactionDetails(Set<String> postCommentIds);

    Mono<Boolean> hasAnyReaction(String postCommentId, String subject);

    Mono<Void> deleteReaction(String postCommentId, String subject);
}
