package blog.errors;

import lombok.Getter;

@Getter
public class I18nException extends RuntimeException {

    private final String code;

    private final Object[] args;

    public I18nException(String message, String code, Object... args) {
        super(message);
        this.code = code;
        this.args = args;
    }

    public I18nException(String message, Throwable cause, String code, Object... args) {
        super(message, cause);
        this.code = code;
        this.args = args;
    }
}
