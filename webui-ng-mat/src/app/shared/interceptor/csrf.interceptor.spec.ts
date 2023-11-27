import { TestBed } from '@angular/core/testing';

import { CsrfInterceptor } from './csrf.interceptor';
import SpyObj = jasmine.SpyObj;
import {CookieService} from "ngx-cookie-service";
import createSpyObj = jasmine.createSpyObj;

describe('CsrfInterceptor', () => {
  let cookieService: SpyObj<CookieService>
  let interceptor: CsrfInterceptor

  beforeEach(() => {
    cookieService = createSpyObj([
      "check",
      "get"
    ])
    TestBed.configureTestingModule({
      providers: [
        CsrfInterceptor,
        {provide: CookieService, useValue: cookieService}
      ]
    })
    interceptor = TestBed.inject(CsrfInterceptor)
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
