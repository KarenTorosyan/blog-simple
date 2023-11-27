package blog.entities.post.out;

import blog.entities.post.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Mono;

public interface PostSearchAdapter {

    Mono<Page<Post>> search(String term, Pageable pageable);

    Mono<Page<Post>> searchByAuthor(String author, String term, Pageable pageable);

    Mono<Long> countBySearchTerm(String term);
}
