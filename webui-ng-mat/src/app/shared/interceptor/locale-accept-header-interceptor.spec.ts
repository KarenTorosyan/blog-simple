import {TestBed} from "@angular/core/testing";
import {LocaleAcceptHeaderInterceptor} from "./locale-accept-header-interceptor";
import SpyObj = jasmine.SpyObj;
import {CookieService} from "ngx-cookie-service";
import createSpyObj = jasmine.createSpyObj;

describe("LocaleAcceptHeaderInterceptor", () => {
  let localeAcceptHeaderInterceptor: LocaleAcceptHeaderInterceptor
  let cookieService: SpyObj<CookieService>

  beforeEach(() => {
    cookieService = createSpyObj([
      "check",
      "set",
      "get"
    ])
    TestBed.configureTestingModule({
      providers: [
        LocaleAcceptHeaderInterceptor,
        {provide: CookieService, useValue: cookieService}
      ]
    })
    localeAcceptHeaderInterceptor = TestBed.inject(LocaleAcceptHeaderInterceptor)
  })

  it('should be created', () => {
    expect(localeAcceptHeaderInterceptor).toBeTruthy()
  });
})
