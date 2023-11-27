package blog.entities.post.in.web;

import blog.entities.post.Post;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostEditRequest(
        @JsonProperty(required = true)
        @NotBlank(message = "{content_required}")
        @Size(max = 200000, message = "{content_max}")
        String content,

        @JsonProperty(required = true)
        @NotBlank(message = "{preview_content_required}")
        @Size(max = 20000, message = "{preview_content_max}")
        String previewContent) {

    @JsonIgnore
    public Post modify(Post post) {
        return post
                .setContent(content)
                .setPreviewContent(previewContent);
    }
}
