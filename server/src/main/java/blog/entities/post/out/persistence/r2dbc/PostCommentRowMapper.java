package blog.entities.post.out.persistence.r2dbc;

import blog.entities.audit.Audit;
import blog.entities.post.PostComment;
import io.r2dbc.spi.Readable;

import java.time.Instant;

public class PostCommentRowMapper {

    public static PostComment map(Readable row) {
        Long reply = row.get("parent_id", Long.class);
        return new PostComment()
                .setId(String.valueOf(row.get("id", Long.class)))
                .setPostId(String.valueOf(row.get("post_id", Long.class)))
                .setSubject(row.get("subject", String.class))
                .setParentId(reply != null ? String.valueOf(reply) : null)
                .setContent(row.get("content", String.class))
                .setAudit(new Audit()
                        .setCreatedDate(row.get("created_date", Instant.class))
                        .setCreatedBy(row.get("created_by", String.class))
                        .setUpdatedDate(row.get("updated_date", Instant.class))
                        .setUpdatedBy(row.get("updated_by", String.class)));
    }
}
