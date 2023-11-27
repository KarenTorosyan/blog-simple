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
public class PostReactionDetails {

    private String postId;

    private String reaction;

    private long count;
}
