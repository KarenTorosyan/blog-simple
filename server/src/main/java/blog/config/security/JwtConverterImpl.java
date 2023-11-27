package blog.config.security;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.BearerTokenAuthentication;
import reactor.core.publisher.Mono;

import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class JwtConverterImpl implements Converter<Jwt, Mono<? extends AbstractAuthenticationToken>> {

    public static final String AUTHORITIES = "authorities";
    public static final String NAME_ATTR = "email";
    public static final String NAME_ATTR_ALTERNATIVE = "sub";

    @Override
    public Mono<? extends AbstractAuthenticationToken> convert(Jwt source) {

        Set<SimpleGrantedAuthority> authorities = Optional.ofNullable(source.getClaimAsStringList(AUTHORITIES))
                .map(strings -> strings.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toSet()))
                .orElse(Set.of());

        String nameAttr = source.hasClaim(NAME_ATTR) ? NAME_ATTR : NAME_ATTR_ALTERNATIVE;
        OAuth2User oAuth2User = new DefaultOAuth2User(authorities, source.getClaims(), nameAttr);

        OAuth2AccessToken oAuth2AccessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER,
                source.getTokenValue(), source.getIssuedAt(), source.getExpiresAt());

        return Mono.just(new BearerTokenAuthentication(
                oAuth2User, oAuth2AccessToken, authorities
        ));
    }
}
