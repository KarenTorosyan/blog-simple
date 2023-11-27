package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostReaction;
import io.r2dbc.spi.Readable;

public class PostReactionRowMapper {

    public static PostReaction map(Readable row) {
        return new PostReaction()
                .setPostId(String.valueOf(row.get("post_id", Long.class)))
                .setSubject(row.get("subject", String.class))
                .setReaction(row.get("reaction", String.class));
    }
}
