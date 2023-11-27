package blog.entities.audit;

import lombok.*;
import lombok.experimental.Accessors;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@ToString
@EqualsAndHashCode(exclude = {"createdDate", "updatedDate"})
public class Audit {

    private Instant createdDate;

    private String createdBy;

    private Instant updatedDate;

    private String updatedBy;
}
