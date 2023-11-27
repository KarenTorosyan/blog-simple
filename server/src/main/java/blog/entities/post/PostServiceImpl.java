package blog.entities.post;

import blog.entities.post.out.PostRepository;
import blog.errors.Errors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import reactor.core.publisher.Mono;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository repository;

    @Transactional
    @Override
    public Mono<Post> create(Post post) {
        return repository.save(post)
                .onErrorMap(e -> Errors.cantCreatePost(post, e));
    }

    @Transactional
    @Override
    public Mono<Post> edit(Post post) {
        return getById(post.getId())
                .flatMap(p -> repository.save(post))
                .onErrorMap(e -> Errors.cantEditPost(post, e));
    }

    @Transactional
    @Override
    public Mono<Void> deleteById(String id) {
        return getById(id)
                .flatMap(post -> repository.deleteById(post.getId()))
                .onErrorMap(e -> Errors.cantDeletePost(id, e));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Post> getById(String id) {
        return repository.findById(id)
                .switchIfEmpty(Mono.error(() -> Errors.postNotFoundById(id)));
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Boolean> existsById(String id) {
        return repository.existsById(id);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<Post>> getAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<Post>> getAllByAuthor(String author, Pageable pageable) {
        return repository.findAllByAuthor(author, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<Post>> search(String text, Pageable pageable) {
        return repository.search(text, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Page<Post>> searchByAuthor(String author, String text, Pageable pageable) {
        return repository.searchByAuthor(author, text, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Mono<Long> getCount() {
        return repository.count();
    }
}
