import {CkeditorFileUploadAdapter} from "./ckeditor-file-upload-adapter";
import {TestBed} from "@angular/core/testing";
import SpyObj = jasmine.SpyObj;
import {FileUploadService} from "../file-upload/file-upload.service";
import createSpyObj = jasmine.createSpyObj;

describe("CkeditorFileUploadAdapter", () => {
  let fileUploadService: SpyObj<FileUploadService>
  const loader = {}

  beforeAll(() => {
    fileUploadService = createSpyObj(["upload"])
    TestBed.configureTestingModule({
      providers: [
        {provide: FileUploadService, useValue: fileUploadService}
      ]
    })
  })

  it('should create instance', () => {
    const instance = new CkeditorFileUploadAdapter(loader, fileUploadService)
    expect(instance).toBeTruthy()
  });
})
