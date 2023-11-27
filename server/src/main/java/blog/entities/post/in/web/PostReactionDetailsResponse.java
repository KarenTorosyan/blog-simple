package blog.entities.post.in.web;

import blog.entities.post.PostReactionDetails;

public record PostReactionDetailsResponse(String postId, String reaction, long count) {

    public static PostReactionDetailsResponse from(PostReactionDetails postReactionDetails) {
        return new PostReactionDetailsResponse(postReactionDetails.getPostId(),
                postReactionDetails.getReaction(), postReactionDetails.getCount());
    }
}
