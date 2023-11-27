package blog.errors;

import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.web.server.ServerWebExchange;

import java.time.Instant;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
@EqualsAndHashCode(exclude = "datetime")
public class ErrorResponse {

    private String uri;

    private Object reason;

    private Instant datetime;

    private Integer status;

    private String details;

    public static ErrorResponse reason(Object reason, ServerWebExchange exchange) {
        return new ErrorResponse()
                .setUri(exchange.getRequest().getURI().getPath())
                .setReason(reason)
                .setDatetime(Instant.now());
    }
}
