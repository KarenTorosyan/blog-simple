package blog.entities.post;

import lombok.*;
import lombok.experimental.Accessors;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@ToString
@EqualsAndHashCode
public class PostCommentReactionDetails {

    private String postCommentId;

    private String reaction;

    private long count;
}
