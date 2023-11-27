package blog.entities.post.in.web;

import blog.entities.post.PostComment;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCommentEditRequest(
        @JsonProperty(required = true)
        @NotBlank(message = "{content_required}")
        @Size(max = 1000, message = "{content_max}")
        String content) {

    @JsonIgnore
    public PostComment modify(PostComment postComment) {
        return postComment.setContent(content);
    }
}
