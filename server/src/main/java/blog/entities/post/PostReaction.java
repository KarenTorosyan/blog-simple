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
public class PostReaction {

    private String postId;

    private String subject;

    private String reaction;
}
