package blog.entities.post.in.web;

import blog.entities.post.PostCommentReactionDetails;

public record PostCommentReactionDetailsResponse(String postCommentId, String reaction, long count) {

    public static PostCommentReactionDetailsResponse from(PostCommentReactionDetails postCommentReactionDetails) {
        return new PostCommentReactionDetailsResponse(postCommentReactionDetails.getPostCommentId(),
                postCommentReactionDetails.getReaction(), postCommentReactionDetails.getCount());
    }
}
