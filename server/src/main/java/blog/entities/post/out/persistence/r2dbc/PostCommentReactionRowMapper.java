package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostCommentReaction;
import io.r2dbc.spi.Readable;

public class PostCommentReactionRowMapper {

    public static PostCommentReaction map(Readable row) {
        return new PostCommentReaction()
                .setPostCommentId(String.valueOf(row.get("post_comment_id", Long.class)))
                .setSubject(row.get("subject", String.class))
                .setReaction(row.get("reaction", String.class));
    }
}
