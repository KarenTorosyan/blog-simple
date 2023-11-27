package blog.entities.post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostCommentService {

    Mono<PostComment> add(PostComment postComment);

    Mono<PostComment> edit(PostComment postComment);

    Mono<Void> delete(String commentId, String postId);

    Mono<PostComment> get(String commentId, String postId);

    Mono<PostComment> getById(String commentId);

    Mono<Boolean> exists(String commentId, String postId);

    Mono<Page<PostComment>> getAll(String postId, Pageable pageable);

    Flux<PostComment> getAllByParentId(String parentId);

    Mono<Page<PostComment>> getAllByAuthor(String author, Pageable pageable);

    Mono<Long> getCount(String postId);
}
