package blog.entities.post.out;

import blog.entities.post.PostComment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

public interface PostCommentRepository {

    Mono<PostComment> save(PostComment comment);

    Mono<Void> delete(String commentId, String postId);

    Mono<Boolean> exists(String commentId, String postId);

    Mono<PostComment> findById(String id);

    Mono<Boolean> existsById(String id);

    Mono<PostComment> find(String commentId, String postId);

    Mono<Page<PostComment>> findAllByParentIdIsNull(String postId, Pageable pageable);

    Flux<PostComment> findAllByParentId(String parentId);

    Mono<Page<PostComment>> findAllBySubject(String subject, Pageable pageable);

    Mono<Long> countByPostId(String postId);

    Mono<Long> countByPostIdAndParentIdIsNull(String postId);

    Mono<Long> countBySubject(String subject);
}
