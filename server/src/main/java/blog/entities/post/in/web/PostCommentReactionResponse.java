package blog.entities.post.in.web;

import blog.entities.post.PostCommentReaction;

public record PostCommentReactionResponse(String subject, String reaction) {

    public static PostCommentReactionResponse from(PostCommentReaction postCommentReaction) {
        return new PostCommentReactionResponse(postCommentReaction.getSubject(), postCommentReaction.getReaction());
    }
}
