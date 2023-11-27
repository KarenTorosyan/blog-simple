package blog.utils;

public class StringUtils {

    public static String toSnakeCaseFromCamelCase(String str) {
        return str.replaceAll("([a-z])([A-Z])", "$1_$2").toLowerCase();
    }
}
