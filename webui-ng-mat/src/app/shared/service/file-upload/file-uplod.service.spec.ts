import {TestBed} from "@angular/core/testing";
import {FileUploadService} from "./file-upload.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import SpyObj = jasmine.SpyObj;
import {FileUploadServerHttpClientErrorHandler} from "./file-upload-server-http-client-error-handler";
import createSpyObj = jasmine.createSpyObj;

describe("FileUploadService", () => {
  let fileUploadService: FileUploadService
  let httpController: HttpTestingController
  let httpClientErrorHandler: SpyObj<FileUploadServerHttpClientErrorHandler>

  beforeAll(() => {
    httpClientErrorHandler = createSpyObj(["handle"])
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        FileUploadService,
        {provide: FileUploadServerHttpClientErrorHandler, useValue: httpClientErrorHandler}
      ]
    })
    fileUploadService = TestBed.inject(FileUploadService)
    httpController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpController.verify()
  })

  it('should be created', () => {
    expect(fileUploadService).toBeTruthy()
  });
})
