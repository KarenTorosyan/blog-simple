package blog.utils;

import blog.errors.Errors;
import org.springframework.data.domain.Sort;

public class Convertor {

    public static long idAsNumberLong(String id) {
        try {
            return Long.parseLong(id);
        } catch (NumberFormatException e) {
            throw Errors.illegalIdType(id);
        }
    }

    public static String toString(Sort sort) {
        return String.join(", ", sort.stream()
                .map(order -> validateSortParam(order.getProperty()) + " " + order.getDirection())
                .toList());
    }

    private static String validateSortParam(String param) {
        if (!param.matches("^[a-zA-Z_]+$")) {
            throw Errors.illegalSortParam(param);
        }
        return StringUtils.toSnakeCaseFromCamelCase(param);
    }
}
