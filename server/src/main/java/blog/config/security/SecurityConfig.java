package blog.config.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.csrf.CookieServerCsrfTokenRepository;
import org.springframework.security.web.server.csrf.ServerCsrfTokenRequestAttributeHandler;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatcher;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;
import org.springframework.web.cors.CorsConfiguration;

import java.util.List;

@Configuration
public class SecurityConfig {

    public static final ServerWebExchangeMatcher[] AUTHENTICATION = {

            ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST,
                    "/posts",
                    "/posts/*/comments",
                    "/posts/*/reactions",
                    "/posts/comments/*/reactions"
            ),
            ServerWebExchangeMatchers.pathMatchers(HttpMethod.PUT,
                    "/posts/*",
                    "/posts/comments/*"
            ),
            ServerWebExchangeMatchers.pathMatchers(HttpMethod.DELETE,
                    "/posts/*",
                    "/posts/comments/*",
                    "/posts/*/reactions",
                    "/posts/comments/*/reactions"
            ),
            ServerWebExchangeMatchers.pathMatchers(HttpMethod.GET,
                    // get by authenticated user
                    "/posts/*/reactions",
                    "/posts/comments/*/reactions",
                    "/posts/comments/reactions"
            )
    };

    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity security) {
        return security
                .cors(c -> c.configurationSource(exchange -> {
                    CorsConfiguration corsConfiguration = new CorsConfiguration();
                    corsConfiguration.setAllowedOrigins(List.of("http://localhost:4200"));
                    corsConfiguration.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Xsrf-Token"));
                    corsConfiguration.setAllowedMethods(List.of("GET", "OPTIONS", "POST", "PUT", "DELETE"));
                    corsConfiguration.setAllowCredentials(true);
                    return corsConfiguration;
                }))
                .csrf(c -> {
                    c.csrfTokenRepository(CookieServerCsrfTokenRepository.withHttpOnlyFalse());
                    c.csrfTokenRequestHandler(new ServerCsrfTokenRequestAttributeHandler());
                })
                .oauth2ResourceServer(c -> c.jwt(jwt ->
                        jwt.jwtAuthenticationConverter(new JwtConverterImpl())))
                .authorizeExchange(c -> {
                    c.matchers(AUTHENTICATION).authenticated();
                    c.anyExchange().permitAll();
                })
                .build();
    }
}
