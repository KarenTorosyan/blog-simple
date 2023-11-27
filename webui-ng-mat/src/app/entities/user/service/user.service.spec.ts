import {TestBed} from "@angular/core/testing";
import {UserService} from "./user.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {SsoServerHttpClientErrorHandler} from "./sso-server-http-client-error-handler";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("UserService", () => {
  let userService: UserService
  let httpController: HttpTestingController
  let ssoServerHttpClientErrorHandler: SpyObj<SsoServerHttpClientErrorHandler>

  beforeAll(() => {
    ssoServerHttpClientErrorHandler = createSpyObj(["handle"])
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService,
        {provide: SsoServerHttpClientErrorHandler, useValue: ssoServerHttpClientErrorHandler}
      ]
    })
    userService = TestBed.inject(UserService)
    httpController = TestBed.inject(HttpTestingController)
  })

  afterAll(() => {
    httpController.verify()
  })

  it('should be created', () => {
    expect(userService).toBeTruthy()
  });
})
