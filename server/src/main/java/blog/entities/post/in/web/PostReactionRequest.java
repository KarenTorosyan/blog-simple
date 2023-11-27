package blog.entities.post.in.web;

import blog.entities.post.PostReaction;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostReactionRequest(
        @JsonProperty(required = true)
        @NotBlank(message = "{reaction_required}")
        @Size(max = 100, message = "{reaction_size}")
        String reaction) {

    @JsonIgnore
    public PostReaction getPostReaction() {
        return new PostReaction()
                .setReaction(reaction);
    }
}
