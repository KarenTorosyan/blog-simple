import {OAuthService} from "angular-oauth2-oidc";
import {Injectable} from "@angular/core";
import {map, Observable, tap} from "rxjs";
import {UserService} from "../entities/user/service/user.service";
import {fromPromise} from "rxjs/internal/observable/innerFrom";
import {UserPublisher} from "../entities/user/service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import {TokenExpiredDialogComponent} from "./token-expired-dialog/token-expired-dialog.component";
import {AppConfigService} from "../shared/service/app-config/app-config.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  private readonly emailClaim = "email"

  constructor(private oAuthService: OAuthService,
              private appConfigService: AppConfigService,
              private userService: UserService,
              private userPublisher: UserPublisher,
              private dialog: MatDialog) {
    this.configure()
  }

  private configure() {
    const config = this.appConfigService.getConfig()
    this.oAuthService.configure({
      issuer: config.oAuth2.issuer,
      redirectUri: location.origin,
      postLogoutRedirectUri: location.origin,
      clientId: config.oAuth2.clientId,
      responseType: config.oAuth2.responseType,
      scope: config.oAuth2.scopes
    })
  }

  login() {
    this.oAuthService.initLoginFlow()
  }

  onLogin(): Observable<boolean> {
    this.oAuthService.events.subscribe(event => {
      if (event.type === "token_expires") {
        this.logout(true)
        this.dialog.open(TokenExpiredDialogComponent, {
          enterAnimationDuration: "100ms",
          exitAnimationDuration: "100ms"
        })
      }
    })
    return fromPromise(this.oAuthService.loadDiscoveryDocumentAndTryLogin()).pipe(
      map(() => this.isAuth),
      tap(isAuth => {
        if (isAuth) {
          this.userService.getByEmail(this.oAuthService.getIdentityClaims()[this.emailClaim])
            .subscribe(user => this.userPublisher.publish(user))
        }
      }));
  }

  get isAuth(): boolean {
    return this.oAuthService.hasValidIdToken()
      && this.oAuthService.hasValidAccessToken()
  }

  logout(noRedirectToLogoutUrl: boolean = false) {
    this.oAuthService.logOut(noRedirectToLogoutUrl)
  }
}
