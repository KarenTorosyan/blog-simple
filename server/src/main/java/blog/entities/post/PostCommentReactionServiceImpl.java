package blog.entities.post;

import blog.entities.post.out.PostCommentReactionRepository;
import blog.errors.Errors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class PostCommentReactionServiceImpl implements PostCommentReactionService {

    private final PostCommentReactionRepository repository;

    @Transactional
    @Override
    public Mono<Void> setReaction(PostCommentReaction postCommentReaction) {
        return hasAnyReaction(postCommentReaction.getPostCommentId(), postCommentReaction.getSubject())
                .flatMap(isTrue -> isTrue ?
                        deleteReaction(postCommentReaction.getPostCommentId(), postCommentReaction.getSubject())
                                .then(Mono.defer(() -> repository.save(postCommentReaction))) :
                        repository.save(postCommentReaction))
                .onErrorMap(e -> Errors.cantSetPostCommentReaction(postCommentReaction.getPostCommentId(),
                        postCommentReaction.getSubject(), postCommentReaction.getReaction(), e));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<PostCommentReaction> getReaction(String postCommentId, String subject) {
        return repository.findByPostCommentIdAndSubject(postCommentId, subject)
                .switchIfEmpty(Mono.error(() -> Errors.postCommentReactionNotFound(postCommentId, subject)));
    }

    @Transactional(readOnly = true)
    @Override
    public Flux<PostCommentReaction> getReactions(Set<String> postCommentIds, String subject) {
        return repository.findByPostCommentIdAndSubject(postCommentIds, subject);
    }

    @Transactional(readOnly = true)
    @Override
    public Flux<PostCommentReactionDetails> getReactionDetails(String postCommentId) {
        return repository.findAllByPostCommentId(postCommentId);
    }

    @Transactional(readOnly = true)
    @Override
    public Flux<PostCommentReactionDetails> getReactionDetails(Set<String> postCommentIds) {
        return repository.findAllByPostCommentId(postCommentIds);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Boolean> hasAnyReaction(String postCommentId, String subject) {
        return repository.existsByPostCommentIdAndSubject(postCommentId, subject);
    }

    @Transactional
    @Override
    public Mono<Void> deleteReaction(String postCommentId, String subject) {
        return getReaction(postCommentId, subject)
                .then(repository.deleteByPostCommentIdAndSubject(postCommentId, subject)
                        .onErrorMap(e -> Errors.cantDeletePostCommentReaction(postCommentId, subject, e)));
    }
}
