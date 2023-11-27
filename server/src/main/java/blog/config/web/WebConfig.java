package blog.config.web;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.config.WebFluxConfigurer;
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer;

@Configuration
@RequiredArgsConstructor
public class WebConfig implements WebFluxConfigurer {

    private final PageableArgumentResolver pageableArgumentResolver;

    @Override
    public void configureArgumentResolvers(ArgumentResolverConfigurer configurer) {
        configurer.addCustomResolver(pageableArgumentResolver.reactivePageable());
        configurer.addCustomResolver(pageableArgumentResolver.reactiveSort());
    }

    @Configuration
    static class SpringDataWebConfig {

        @Bean
        SpringDataWebProperties springDataWebProperties() {
            return new SpringDataWebProperties();
        }
    }
}

