package blog.entities.post.out.persistence.r2dbc;

import blog.entities.audit.Audit;
import blog.entities.post.Post;
import io.r2dbc.spi.Readable;

import java.time.Instant;

public class PostRowMapper {

    public static Post map(Readable row) {
        return new Post()
                .setId(String.valueOf(row.get("id", Long.class)))
                .setAuthor(row.get("author", String.class))
                .setContent(row.get("content", String.class))
                .setPreviewContent(row.get("preview_content", String.class))
                .setAudit(new Audit()
                        .setCreatedDate(row.get("created_date", Instant.class))
                        .setCreatedBy(row.get("created_by", String.class))
                        .setUpdatedDate(row.get("updated_date", Instant.class))
                        .setUpdatedBy(row.get("updated_by", String.class)));
    }
}
