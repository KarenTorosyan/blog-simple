package blog.entities.post.in.web;

import blog.entities.post.PostReaction;

public record PostReactionResponse(String subject, String reaction) {

    public static PostReactionResponse from(PostReaction postReaction) {
        return new PostReactionResponse(postReaction.getSubject(), postReaction.getReaction());
    }
}
