package blog.config.web;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.web.ReactivePageableHandlerMethodArgumentResolver;
import org.springframework.data.web.ReactiveSortHandlerMethodArgumentResolver;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PageableArgumentResolver {
    
    private final SpringDataWebProperties springDataWebProperties;

    public ReactivePageableHandlerMethodArgumentResolver reactivePageable() {
        var resolver = new ReactivePageableHandlerMethodArgumentResolver();
        var pageable = springDataWebProperties.getPageable();
        resolver.setPageParameterName(pageable.getPageParameter());
        resolver.setSizeParameterName(pageable.getSizeParameter());
        resolver.setOneIndexedParameters(pageable.isOneIndexedParameters());
        resolver.setPrefix(pageable.getPrefix());
        resolver.setQualifierDelimiter(pageable.getQualifierDelimiter());
        resolver.setFallbackPageable(PageRequest.of(pageable.isOneIndexedParameters() ? 1 : 0,
                pageable.getDefaultPageSize()));
        resolver.setMaxPageSize(pageable.getMaxPageSize());
        return resolver;
    }

    public ReactiveSortHandlerMethodArgumentResolver reactiveSort() {
        var resolver = new ReactiveSortHandlerMethodArgumentResolver();
        var sort = springDataWebProperties.getSort();
        resolver.setSortParameter(sort.getSortParameter());
        return resolver;
    }
}
