package blog.errors;

public class IllegalParamException extends I18nException {

    public IllegalParamException(String message, String code, Object... args) {
        super(message, code, args);
    }
}
