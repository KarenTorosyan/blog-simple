package blog.entities.post.out.persistence.r2dbc;

import blog.entities.post.PostReactionDetails;
import io.r2dbc.spi.Readable;

import java.util.Objects;

public class PostReactionDetailsRowMapper {

    public static PostReactionDetails map(Readable row) {
        return new PostReactionDetails()
                .setPostId(String.valueOf(row.get("post_id", Long.class)))
                .setReaction(row.get("reaction", String.class))
                .setCount(Objects.requireNonNull(row.get("reaction_count", Long.class)));
    }
}
