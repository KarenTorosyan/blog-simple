package blog.entities.post.in.web;

import blog.entities.post.PostComment;

import java.time.Instant;

public record PostCommentResponse(String id,
                                  String postId,
                                  String parentId,
                                  String subject,
                                  String content,
                                  Instant createdDate,
                                  String createdBy,
                                  Instant updatedDate,
                                  String updatedBy) {

    public static PostCommentResponse from(PostComment postComment) {
        return new PostCommentResponse(
                postComment.getId(),
                postComment.getPostId(),
                postComment.getParentId(),
                postComment.getSubject(),
                postComment.getContent(),
                postComment.getAudit().getCreatedDate(),
                postComment.getAudit().getCreatedBy(),
                postComment.getAudit().getUpdatedDate(),
                postComment.getAudit().getUpdatedBy());
    }
}
