package blog.errors;

import blog.utils.I18nMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.server.ServerWebExchange;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestControllerAdvice
@RequiredArgsConstructor
public class ErrorsHandlerRest {

    private final MessageSource messageSource;

    @ExceptionHandler(WebExchangeBindException.class)
    ResponseEntity<ErrorResponse> handle(WebExchangeBindException e,
                                         ServerWebExchange exchange) {
        List<Map<String, String>> errors = e.getFieldErrors().stream()
                .map(error -> Map.of(error.getField(),
                        Objects.requireNonNull(error.getDefaultMessage())))
                .toList();
        return ResponseEntity.badRequest()
                .body(ErrorResponse.reason(errors, exchange)
                        .setStatus(HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(IllegalParamException.class)
    ResponseEntity<ErrorResponse> handle(IllegalParamException e,
                                         ServerWebExchange exchange) {
        String message = I18nMessage.localize(messageSource, exchange, e);
        return ResponseEntity.badRequest()
                .body(ErrorResponse.reason(message, exchange)
                        .setStatus(HttpStatus.BAD_REQUEST.value()));
    }

    @ExceptionHandler(EntityConflictException.class)
    ResponseEntity<ErrorResponse> handle(EntityConflictException e,
                                         ServerWebExchange exchange) {
        String message = I18nMessage.localize(messageSource, exchange, e);
        return new ResponseEntity<>(ErrorResponse.reason(message, exchange)
                .setStatus(HttpStatus.CONFLICT.value())
                .setDetails(e.getCause().toString()),
                HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EntityNotFoundException.class)
    ResponseEntity<ErrorResponse> handle(EntityNotFoundException e,
                                         ServerWebExchange exchange) {
        String message = I18nMessage.localize(messageSource, exchange, e);
        return new ResponseEntity<>(ErrorResponse.reason(message, exchange)
                .setStatus(HttpStatus.NOT_FOUND.value()),
                HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessException.class)
    ResponseEntity<ErrorResponse> handle(AccessException e,
                                         ServerWebExchange exchange) {
        String message = I18nMessage.localize(messageSource, exchange, e);
        return new ResponseEntity<>(ErrorResponse.reason(message, exchange)
                .setStatus(HttpStatus.FORBIDDEN.value()),
                HttpStatus.FORBIDDEN);
    }
}
