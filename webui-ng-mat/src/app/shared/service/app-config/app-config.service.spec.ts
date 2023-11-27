import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {AppConfigService} from "./app-config.service";

describe("AppConfigService", () => {
  let appConfigService: AppConfigService
  let httpController: HttpTestingController

  beforeAll(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AppConfigService
      ]
    })
    appConfigService = TestBed.inject(AppConfigService)
    httpController = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(appConfigService).toBeTruthy()
  });
})
