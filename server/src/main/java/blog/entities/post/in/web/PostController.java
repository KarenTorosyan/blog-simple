package blog.entities.post.in.web;

import blog.config.swagger.annotation.*;
import blog.entities.audit.Audit;
import blog.entities.post.*;
import blog.errors.Errors;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.util.UriComponentsBuilder;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.Set;

@RestController
@RequiredArgsConstructor
@Tag(name = "Post")
public class PostController {

    private final PostService postService;

    private final PostCommentService postCommentService;

    private final PostReactionService postReactionService;

    private final PostCommentReactionService postCommentReactionService;

    @GetMapping("/posts")
    @ApiDocGetMappingResponsePage(summary = "Get all posts (public)")
    ResponseEntity<Mono<Page<PostResponse>>> getPosts(@RequestParam(required = false) String term,
                                                      @RequestParam(required = false) String author,
                                                      @ApiDocHide Pageable pageable) {
        Mono<Page<Post>> pageOfPosts = term == null ? postService.getAll(pageable) :
                postService.search(term, pageable);
        Mono<Page<Post>> pageOfPostsByAuthor = term == null ? postService.getAllByAuthor(author, pageable) :
                postService.searchByAuthor(author, term, pageable);
        Mono<Page<Post>> response = author == null ? pageOfPosts : pageOfPostsByAuthor;
        return ResponseEntity.ok(response.map(posts -> posts.map(PostResponse::from)));
    }

    @GetMapping("/posts/{id}")
    @ApiDocGetMapping(summary = "Get post by id (public)")
    ResponseEntity<Mono<PostResponse>> getPostById(@PathVariable String id) {
        return ResponseEntity.ok(postService.getById(id)
                .map(PostResponse::from));
    }

    @PostMapping("/posts")
    @ApiDocPostMappingRequireAuthorization(summary = "Create post (authorization required)")
    Mono<ResponseEntity<Void>> createPost(@RequestBody @Validated PostCreateRequest request,
                                          @AuthenticationPrincipal OAuth2User oAuth2User,
                                          @ApiDocHide ServerWebExchange exchange) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromUri(exchange.getRequest().getURI())
                .path("/{id}");
        return postService.create(request.getPost()
                        .setAuthor(oAuth2User.getName())
                        .setAudit(new Audit()
                                .setCreatedDate(Instant.now())
                                .setCreatedBy(oAuth2User.getName())))
                .map(post -> ResponseEntity.created(uri.build(post.getId()))
                        .build());
    }

    @PutMapping("/posts/{id}")
    @ApiDocPutMappingRequireAuthorization(summary = "Edit post by id (authorization required)")
    Mono<ResponseEntity<Void>> editPost(@PathVariable String id,
                                        @RequestBody @Validated PostEditRequest request,
                                        @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postService.getById(id)
                .flatMap(post -> post.getAuthor().equals(oAuth2User.getName()) ?
                        postService.edit(request.modify(post)
                                .setAudit(post.getAudit()
                                        .setUpdatedDate(Instant.now())
                                        .setUpdatedBy(oAuth2User.getName()))) :
                        Mono.error(Errors.noEnoughAccess(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @DeleteMapping("/posts/{id}")
    @ApiDocDeleteMappingRequireAuthorization(summary = "Delete post by id (authorization required)")
    Mono<ResponseEntity<Void>> deletePost(@PathVariable String id,
                                          @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postService.getById(id)
                .flatMap(post -> post.getAuthor().equals(oAuth2User.getName()) ?
                        postService.deleteById(post.getId()) :
                        Mono.error(Errors.noEnoughAccess(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @GetMapping("/posts/{id}/comments")
    @ApiDocGetMappingResponsePage(summary = "Get post comments (public)")
    ResponseEntity<Mono<Page<PostCommentResponse>>> getComments(@PathVariable String id,
                                                                @ApiDocHide Pageable pageable) {
        return ResponseEntity.ok(postCommentService.getAll(id, pageable)
                .map(postComments -> postComments.map(PostCommentResponse::from)));
    }

    @GetMapping("/posts/comments/children/{parentId}")
    @ApiDocGetMappingResponseCollection(summary = "Get comment children (public)")
    ResponseEntity<Flux<PostCommentResponse>> getCommentChildren(@PathVariable String parentId) {
        return ResponseEntity.ok(postCommentService.getAllByParentId(parentId)
                .map(PostCommentResponse::from));
    }

    @GetMapping("/posts/comments/{subject}")
    @ApiDocGetMappingResponsePage(summary = "Get all post comments of subject (public)")
    ResponseEntity<Mono<Page<PostCommentResponse>>> getAllPostCommentsOfSubject(@ApiDocHide Pageable pageable,
                                                                                @PathVariable String subject) {
        return ResponseEntity.ok(postCommentService.getAllByAuthor(subject, pageable)
                .map(postComments -> postComments.map(PostCommentResponse::from)));
    }

    @GetMapping("/posts/{id}/comments/{commentId}")
    @ApiDocGetMapping(summary = "Get post comment by postId, commentId (public)")
    ResponseEntity<Mono<PostCommentResponse>> getComment(@PathVariable String id,
                                                         @PathVariable String commentId) {
        return ResponseEntity.ok(postCommentService.get(commentId, id)
                .map(PostCommentResponse::from));
    }

    @PostMapping("/posts/{id}/comments")
    @ApiDocPostMappingRequireAuthorization(summary = "Add post comment (authorization required)")
    Mono<ResponseEntity<Void>> addComment(@PathVariable String id,
                                          @RequestBody @Validated PostCommentAddRequest request,
                                          @AuthenticationPrincipal OAuth2User oAuth2User,
                                          @ApiDocHide ServerWebExchange exchange) {
        UriComponentsBuilder uri = UriComponentsBuilder.fromUri(exchange.getRequest().getURI())
                .path("/{id}");
        return postService.getById(id)
                .flatMap(post -> postCommentService.add(request.getPostComment()
                                .setPostId(post.getId())
                                .setSubject(oAuth2User.getName())
                                .setAudit(new Audit()
                                        .setCreatedDate(Instant.now())
                                        .setCreatedBy(oAuth2User.getName())))
                        .map(postComment -> ResponseEntity.created(uri.build(postComment.getId()))
                                .build()));
    }

    @PutMapping("/posts/comments/{commentId}")
    @ApiDocPutMappingRequireAuthorization(summary = "Edit post comment by commentId (authorization required)")
    Mono<ResponseEntity<Void>> editComment(@PathVariable String commentId,
                                           @RequestBody @Validated PostCommentEditRequest request,
                                           @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postCommentService.getById(commentId)
                .flatMap(postComment -> postComment.getSubject().equals(oAuth2User.getName()) ?
                        postCommentService.edit(request.modify(postComment)
                                .setAudit(postComment.getAudit()
                                        .setUpdatedDate(Instant.now())
                                        .setUpdatedBy(oAuth2User.getName()))) :
                        Mono.error(Errors.noEnoughAccess(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @DeleteMapping("/posts/comments/{commentId}")
    @ApiDocDeleteMappingRequireAuthorization(summary = "Delete post comment by commentId (authorization required)")
    Mono<ResponseEntity<Void>> deleteComment(@PathVariable String commentId,
                                             @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postCommentService.getById(commentId)
                .flatMap(postComment -> postComment.getSubject().equals(oAuth2User.getName()) ?
                        postCommentService.delete(postComment.getId(), postComment.getPostId()) :
                        Mono.error(Errors.noEnoughAccess(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }
    
    @GetMapping("/posts/{id}/reactions/details")
    @ApiDocGetMappingResponseCollection(summary = "Get post reactions details (public)")
    ResponseEntity<Flux<PostReactionDetailsResponse>> getPostReactionDetails(@PathVariable String id) {
        return ResponseEntity.ok(postReactionService.getReactionDetails(id)
                .map(PostReactionDetailsResponse::from));
    }

    @GetMapping("/posts/{id}/reactions")
    @ApiDocGetMappingResponseCollection(summary = "Get post reaction of current subject (authorization required)")
    ResponseEntity<Mono<PostReactionResponse>> getPostReaction(@PathVariable String id,
                                                               @AuthenticationPrincipal OAuth2User oAuth2User) {
        return ResponseEntity.ok(postReactionService.getReactionOfSubject(id, oAuth2User.getName())
                .map(PostReactionResponse::from));
    }

    @PostMapping("/posts/{id}/reactions")
    @ApiDocPostMappingRequireAuthorization(summary = "Set post reaction (authorization required)")
    Mono<ResponseEntity<Void>> setPostReaction(@PathVariable String id,
                                               @RequestBody @Validated PostReactionRequest request,
                                               @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postService.getById(id)
                .flatMap(post -> postReactionService.setReaction(request.getPostReaction()
                        .setPostId(post.getId())
                        .setSubject(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @DeleteMapping("/posts/{id}/reactions")
    @ApiDocDeleteMappingRequireAuthorization(summary = "Delete post reaction (authorization required)")
    Mono<ResponseEntity<Void>> deleteReaction(@PathVariable String id,
                                              @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postReactionService.getReactionOfSubject(id, oAuth2User.getName())
                .flatMap(postReactionSubject -> postReactionService.deleteReaction(id, postReactionSubject.getSubject()))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @GetMapping("/posts/comments/{commentId}/reactions/details")
    @ApiDocGetMappingResponseCollection(summary = "Get post comment reaction details (public)")
    ResponseEntity<Flux<PostCommentReactionDetailsResponse>> getPostCommentReactionDetails(@PathVariable String commentId) {
        return ResponseEntity.ok(postCommentService.getById(commentId)
                .flatMapMany(postComment -> postCommentReactionService.getReactionDetails(postComment.getId()))
                .map(PostCommentReactionDetailsResponse::from));
    }

    @GetMapping("/posts/comments/reactions/details")
    @ApiDocGetMappingResponseCollection(summary = "Get post comment reaction details (public)")
    ResponseEntity<Flux<PostCommentReactionDetailsResponse>> getPostCommentReactionDetails(@RequestParam Set<String> commentId) {
        return ResponseEntity.ok(postCommentReactionService.getReactionDetails(commentId)
                .map(PostCommentReactionDetailsResponse::from));
    }

    @GetMapping("/posts/comments/{commentId}/reactions")
    @ApiDocGetMappingRequireAuthorization(summary = "Get post comment reaction of subject (authorization required)")
    ResponseEntity<Mono<PostCommentReactionResponse>> getPostCommentReaction(@PathVariable String commentId,
                                                                             @AuthenticationPrincipal OAuth2User oAuth2User) {
        return ResponseEntity.ok(postCommentService.getById(commentId)
                .flatMap(postComment -> postCommentReactionService.getReaction(postComment.getId(), oAuth2User.getName()))
                .map(PostCommentReactionResponse::from));
    }

    @GetMapping("/posts/comments/reactions")
    @ApiDocGetMappingRequireAuthorization(summary = "Get post comment reactions of subject (authorization required)")
    ResponseEntity<Flux<PostCommentReaction>> getCommentReactionsOfSubject(@RequestParam Set<String> commentId,
                                                                           @AuthenticationPrincipal OAuth2User oAuth2User) {
        return ResponseEntity.ok(postCommentReactionService.getReactions(commentId, oAuth2User.getName()));
    }

    @PostMapping("/posts/comments/{commentId}/reactions")
    @ApiDocPostMappingRequireAuthorization(summary = "Set post comment reaction (authorization required)")
    Mono<ResponseEntity<Void>> setPostCommentReaction(@PathVariable String commentId,
                                                      @RequestBody PostCommentReactionRequest request,
                                                      @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postCommentService.getById(commentId)
                .flatMap(postComment -> postCommentReactionService.setReaction(request.getPostCommentReaction()
                        .setPostCommentId(postComment.getId())
                        .setSubject(oAuth2User.getName())))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }

    @DeleteMapping("/posts/comments/{commentId}/reactions")
    @ApiDocDeleteMappingRequireAuthorization(summary = "Delete post comment reaction (authorization required)")
    Mono<ResponseEntity<Void>> deletePostCommentReaction(@PathVariable String commentId,
                                                         @AuthenticationPrincipal OAuth2User oAuth2User) {
        return postCommentService.getById(commentId)
                .flatMap(postComment -> postCommentReactionService.deleteReaction(postComment.getId(), oAuth2User.getName()))
                .then(Mono.just(ResponseEntity.noContent().build()));
    }
}
