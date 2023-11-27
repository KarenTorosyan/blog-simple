package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostCommentReactionDetails;
import io.r2dbc.spi.Readable;

import java.util.Objects;

public class PostCommentReactionDetailsRowMapper {

    public static PostCommentReactionDetails map(Readable row) {
        return new PostCommentReactionDetails()
                .setPostCommentId(String.valueOf(row.get("post_comment_id", Long.class)))
                .setReaction(row.get("reaction", String.class))
                .setCount(Objects.requireNonNull(row.get("reaction_count", Long.class)));
    }
}
