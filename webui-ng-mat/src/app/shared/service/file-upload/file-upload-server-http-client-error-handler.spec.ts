import {TestBed} from "@angular/core/testing";
import {MatSnackBar} from "@angular/material/snack-bar";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {FileUploadServerHttpClientErrorHandler} from "./file-upload-server-http-client-error-handler";

describe("FileUploadServerHttpClientErrorHandler", () => {
  let fileUploadServerHttpClientErrorHandler: FileUploadServerHttpClientErrorHandler
  let snackbar: SpyObj<MatSnackBar>

  beforeAll(() => {
    snackbar = createSpyObj(["open"])
    TestBed.configureTestingModule({
      providers: [
        FileUploadServerHttpClientErrorHandler,
        {provide: MatSnackBar, useValue: snackbar}
      ]
    })
    fileUploadServerHttpClientErrorHandler = TestBed.inject(FileUploadServerHttpClientErrorHandler)
  })

  it('should be created', () => {
    expect(fileUploadServerHttpClientErrorHandler).toBeTruthy()
  });
})
