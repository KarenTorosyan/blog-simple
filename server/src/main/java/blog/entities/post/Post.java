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
public class Post {

    private String id;

    private String author;

    private String content;

    private String previewContent;

    private Audit audit;
}
