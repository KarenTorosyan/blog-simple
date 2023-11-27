package blog.entities.post;

import blog.entities.post.out.PostCommentRepository;
import blog.errors.Errors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PostCommentServiceImpl implements PostCommentService {

    private final PostCommentRepository repository;

    @Transactional
    @Override
    public Mono<PostComment> add(PostComment postComment) {
        return repository.save(postComment)
                .onErrorMap(e -> Errors.cantAddPostComment(postComment, e));
    }

    @Transactional
    @Override
    public Mono<PostComment> edit(PostComment postComment) {
        return get(postComment.getId(), postComment.getPostId())
                .flatMap(p -> repository.save(postComment))
                .onErrorMap(e -> Errors.cantEditPostComment(postComment, e));
    }

    @Transactional
    @Override
    public Mono<Void> delete(String commentId, String postId) {
        return get(commentId, postId)
                .then(repository.delete(commentId, postId))
                .onErrorMap(e -> Errors.cantDeletePostComment(commentId, postId, e));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<PostComment> get(String commentId, String postId) {
        return repository.find(commentId, postId)
                .switchIfEmpty(Mono.error(() -> Errors.postCommentNotFoundByIds(postId, commentId)));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<PostComment> getById(String commentId) {
        return repository.findById(commentId)
                .switchIfEmpty(Mono.error(() -> Errors.postCommentNotFoundById(commentId)));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Boolean> exists(String commentId, String postId) {
        return repository.exists(commentId, postId);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<PostComment>> getAll(String postId, Pageable pageable) {
        return repository.findAllByParentIdIsNull(postId, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Flux<PostComment> getAllByParentId(String parentId) {
        return repository.findAllByParentId(parentId);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<PostComment>> getAllByAuthor(String author, Pageable pageable) {
        return repository.findAllBySubject(author, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Long> getCount(String postId) {
        return repository.countByPostId(postId);
    }
}
