import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request.clone({
      setHeaders: this.resolve()
    }));
  }

  resolve(): any {
    if (this.cookieService.check("XSRF-TOKEN")) {
      return {
        "X-XSRF-TOKEN": this.cookieService.get("XSRF-TOKEN")
      }
    }
    return {}
  }
}
