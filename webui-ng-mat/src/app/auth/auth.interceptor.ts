import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OAuthService} from "angular-oauth2-oidc";
import {AppConfigService} from "../shared/service/app-config/app-config.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private oAuthService: OAuthService,
              private appConfigService: AppConfigService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request.clone({
      setHeaders: this.resolve(request.url)
    }));
  }

  private resolve(url: string): any {
    const config = this.appConfigService.getConfig()
    const secure = [
      config.oAuth2.issuer,
      config.apiBlog
    ]
    if (secure.find(api => url.startsWith(api)) &&
      this.oAuthService.hasValidAccessToken() &&
      this.oAuthService.getAccessTokenExpiration() > Date.now()) {
      return {"Authorization": `Bearer ${this.oAuthService.getAccessToken()}`}
    }
    return {};
  }
}
