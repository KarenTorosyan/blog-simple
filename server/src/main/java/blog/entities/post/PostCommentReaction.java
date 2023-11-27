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
public class PostCommentReaction {

    private String postCommentId;

    private String subject;

    private String reaction;
}
