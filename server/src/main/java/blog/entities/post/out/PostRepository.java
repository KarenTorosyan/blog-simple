package blog.entities.post.out;

import blog.entities.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;

public interface PostRepository {

    Mono<Post> save(Post post);

    Mono<Void> deleteById(String id);

    Mono<Post> findById(String id);

    Mono<Boolean> existsById(String id);

    Mono<Page<Post>> findAll(Pageable pageable);

    Mono<Page<Post>> findAllByAuthor(String author, Pageable pageable);

    Mono<Page<Post>> search(String term, Pageable pageable);

    Mono<Page<Post>> searchByAuthor(String author, String term, Pageable pageable);

    Mono<Long> count();

    Mono<Long> countByAuthor(String author);
}
