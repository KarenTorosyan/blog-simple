package blog.config.swagger;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.properties.SwaggerUiOAuthProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class SwaggerConfig {

    @Bean
    OpenAPI openAPI(SwaggerUiOAuthProperties swaggerUiOAuthProperties) {
        return new OpenAPI()
                .info(new Info().title("Blog").version("1.0")
                        .description("API Documentation of application")
                        .license(new License()
                                .name("Apache 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .components(new Components().securitySchemes(
                        Map.of("oAuth2", oauth2SecurityScheme(swaggerUiOAuthProperties),
                                "bearer-token", bearerTokenSecurityScheme())
                ))
                .addSecurityItem(new SecurityRequirement()
                        .addList("oAuth2")
                        .addList("bearer-token"));
    }

    private SecurityScheme oauth2SecurityScheme(SwaggerUiOAuthProperties swaggerUiOAuthProperties) {
        Map<String, String> params = swaggerUiOAuthProperties.getAdditionalQueryStringParams();
        return new SecurityScheme()
                .type(SecurityScheme.Type.OAUTH2)
                .flows(new OAuthFlows().authorizationCode(new OAuthFlow()
                        .authorizationUrl(params.get("authorization-uri"))
                        .tokenUrl(params.get("token-uri"))
                )).description("OAuth2 Authorization");
    }

    private SecurityScheme bearerTokenSecurityScheme() {
        return new SecurityScheme()
                .type(SecurityScheme.Type.HTTP)
                .in(SecurityScheme.In.HEADER)
                .scheme("bearer")
                .bearerFormat("jwt")
                .description("Bearer Token Authorization");
    }
}
