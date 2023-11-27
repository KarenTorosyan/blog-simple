package blog.entities.post;

import blog.entities.audit.Audit;
import lombok.*;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@ToString
@EqualsAndHashCode
public class PostComment {

    private String id;

    private String postId;

    private String parentId;

    private String subject;

    private String content;

    private Audit audit;
}
