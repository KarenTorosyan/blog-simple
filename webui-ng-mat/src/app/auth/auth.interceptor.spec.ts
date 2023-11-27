import {TestBed} from '@angular/core/testing';

import {AuthInterceptor} from './auth.interceptor';
import {OAuthService} from "angular-oauth2-oidc";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AppConfig, AppConfigService} from "../shared/service/app-config/app-config.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AuthInterceptor', () => {
  let authInterceptor: AuthInterceptor
  let oAuthService: SpyObj<OAuthService>
  let appConfigService: SpyObj<AppConfigService>
  let httpController: HttpTestingController
  let httpClient: HttpClient

  beforeEach(() => {
    oAuthService = createSpyObj([
      "hasValidAccessToken",
      "getAccessTokenExpiration",
      "getAccessToken"
    ])
    appConfigService = createSpyObj(["getConfig"])
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {provide: OAuthService, useValue: oAuthService},
        {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
      ]
    })
    authInterceptor = TestBed.inject(AuthInterceptor)
    httpController = TestBed.inject(HttpTestingController)
    httpClient = TestBed.inject(HttpClient)
  });

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });

  it('should set \'Authorization\' header with \'Bearer\' token when access token is valid and not expired', () => {
    oAuthService.hasValidAccessToken.and.returnValue(true)
    oAuthService.getAccessTokenExpiration.and.returnValue(Date.now() + 1000)
    const accessToken = "accessToken"
    oAuthService.getAccessToken.and.returnValue(accessToken)
    appConfigService.getConfig.and.returnValue({oAuth2: {issuer: "http://localhost:9000"}} as AppConfig)
    const secureUrl = `${appConfigService.getConfig().oAuth2.issuer}/path`

    httpClient.get(secureUrl).subscribe()

    const httpRequest = httpController.expectOne(secureUrl);
    expect(httpRequest.request.headers.get("Authorization"))
      .toEqual(`Bearer ${accessToken}`)

    httpController.verify()
  });
});
