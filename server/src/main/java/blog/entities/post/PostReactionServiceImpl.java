package blog.entities.post;

import blog.entities.post.out.PostReactionRepository;
import blog.errors.Errors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PostReactionServiceImpl implements PostReactionService {

    private final PostReactionRepository repository;

    @Transactional
    @Override
    public Mono<Void> setReaction(PostReaction postReaction) {
        return hasAnyReaction(postReaction.getPostId(), postReaction.getSubject())
                .flatMap(isTrue -> isTrue ?
                        deleteReaction(postReaction.getPostId(), postReaction.getSubject())
                                .then(Mono.defer(() -> repository.save(postReaction))) :
                        repository.save(postReaction))
                .onErrorMap(e -> Errors.cantSetPostReaction(postReaction.getPostId(),
                        postReaction.getSubject(), postReaction.getReaction(), e));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<PostReaction> getReactionOfSubject(String postId, String subject) {
        return repository.findByPostIdAndSubject(postId, subject)
                .switchIfEmpty(Mono.error(() -> Errors.postReactionNotFound(postId, subject)));
    }

    @Transactional(readOnly = true)
    @Override
    public Flux<PostReactionDetails> getReactionDetails(String postId) {
        return repository.findAllByPostId(postId);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Boolean> hasAnyReaction(String postId, String subject) {
        return repository.existsByPostIdAndSubject(postId, subject);
    }

    @Transactional
    @Override
    public Mono<Void> deleteReaction(String postId, String subject) {
        return getReactionOfSubject(postId, subject)
                .then(repository.deleteByPostIdAndSubject(postId, subject)
                        .onErrorMap(e -> Errors.cantDeletePostReaction(postId, subject, e)));
    }
}
