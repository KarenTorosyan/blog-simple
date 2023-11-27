package blog.entities.post.in.web;

import blog.entities.post.Post;

import java.time.Instant;

public record PostResponse(String id,
                           String author,
                           String content,
                           String previewContent,
                           Instant createdDate,
                           String createdBy,
                           Instant updatedDate,
                           String updatedBy) {

    public static PostResponse from(Post post) {
        return new PostResponse(
                post.getId(),
                post.getAuthor(),
                post.getContent(),
                post.getPreviewContent(),
                post.getAudit().getCreatedDate(),
                post.getAudit().getCreatedBy(),
                post.getAudit().getUpdatedDate(),
                post.getAudit().getUpdatedBy()
        );
    }
}