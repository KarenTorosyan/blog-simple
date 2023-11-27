import {TestBed} from "@angular/core/testing";
import {OAuthService} from "angular-oauth2-oidc";
import {UserService} from "../entities/user/service/user.service";
import {UserPublisher} from "../entities/user/service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "./auth.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {AppConfig, AppConfigService} from "../shared/service/app-config/app-config.service";

describe('AuthService', () => {
  let authService: AuthService;
  let oAuthService: SpyObj<OAuthService>
  let appConfigService: SpyObj<AppConfigService>
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let dialog: SpyObj<MatDialog>

  beforeAll(() => {
    oAuthService = createSpyObj([
      "configure",
      "initLoginFlow",
      "events",
      "loadDiscoveryDocumentAndTryLogin",
      "getIdentityClaims",
      "hasValidIdToken",
      "hasValidAccessToken",
      "logOut"
    ])
    appConfigService = createSpyObj(["getConfig"])
    userService = createSpyObj(["getByEmail"])
    userPublisher = createSpyObj(["publish"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      providers: [AuthService,
        {provide: OAuthService, useValue: oAuthService},
        {provide: AppConfigService, useValue: appConfigService},
        {provide: UserService, useValue: userService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: MatDialog, useValue: dialog}
      ]
    })
    appConfigService.getConfig.and.returnValue({
      oAuth2: {
        issuer: "http://localhost:9000",
        clientId: "public",
        responseType: "code",
        scopes: "openid profile"
      }
    } as AppConfig)
    authService = TestBed.inject(AuthService)
  })

  it('should be created', () => {
    expect(authService).toBeTruthy()
  });

  it('should login when call', () => {
    authService.login()
    expect(oAuthService.initLoginFlow)
      .toHaveBeenCalled()
  });

  it('should return true when client is authorized', () => {
    oAuthService.hasValidIdToken.and.returnValue(true)
    oAuthService.hasValidAccessToken.and.returnValue(true)
    expect(authService.isAuth)
      .toEqual(true)
  });

  it('should return false when client is not authorized', () => {
    oAuthService.hasValidIdToken.and.returnValue(true)
    oAuthService.hasValidAccessToken.and.returnValue(false)
    expect(authService.isAuth)
      .toEqual(false)
  });

  it('should logout when call', () => {
    const noRedirectToLogoutUrl = true
    authService.logout(noRedirectToLogoutUrl)
    expect(oAuthService.logOut)
      .toHaveBeenCalled()
  });
})
