import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {CookieOptions, CookieService} from "ngx-cookie-service";

@Injectable()
export class LocaleAcceptHeaderInterceptor implements HttpInterceptor {

    cookieName = "locale"

    defaultLocale = "en-US"

    cookieExpirationDays = 1000

    constructor(private cookieService: CookieService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req.clone({
            setHeaders: this.resolve()
        }))
    }

    private resolve(): any {

        if (!this.cookieService.check(this.cookieName)) {

            this.cookieService.set(this.cookieName, this.defaultLocale, <CookieOptions>{
                expires: this.cookieExpirationDays,
                path: "/"
            })
        }

        return {
            "Accept-Language": this.cookieService.get(this.cookieName)
        };
    }
}
