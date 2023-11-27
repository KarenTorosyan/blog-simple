package blog.errors;

public class AccessException extends I18nException {

    public AccessException(String message, String code, Object... args) {
        super(message, code, args);
    }
}
