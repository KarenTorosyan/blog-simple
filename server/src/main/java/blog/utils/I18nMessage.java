package blog.utils;

import blog.errors.I18nException;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.web.server.ServerWebExchange;

import java.util.Locale;

public class I18nMessage {

    public static String localize(MessageSource messageSource, String defaultMessage,
                                  String code, Object[] args, Locale locale) {
        return messageSource.getMessage(code, args, defaultMessage, locale);
    }

    public static String localize(MessageSource messageSource, ServerWebExchange exchange, I18nException e) {
        return localize(messageSource, e.getMessage(),e.getCode(), e.getArgs(),
                LocaleContextHolder.getLocale(exchange.getLocaleContext()));
    }
}
