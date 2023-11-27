package blog.errors;

public class EntityConflictException extends I18nException {

    public EntityConflictException(String message, Throwable cause, String code, Object... args) {
        super(message, cause, code, args);
    }
}
