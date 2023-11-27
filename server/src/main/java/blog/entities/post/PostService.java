package blog.entities.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;

public interface PostService {

    Mono<Post> create(Post post);

    Mono<Post> edit(Post post);

    Mono<Void> deleteById(String id);

    Mono<Post> getById(String id);

    Mono<Boolean> existsById(String id);

    Mono<Page<Post>> getAll(Pageable pageable);

    Mono<Page<Post>> getAllByAuthor(String author, Pageable pageable);

    Mono<Page<Post>> search(String text, Pageable pageable);

    Mono<Page<Post>> searchByAuthor(String author, String text, Pageable pageable);

    Mono<Long> getCount();
}
