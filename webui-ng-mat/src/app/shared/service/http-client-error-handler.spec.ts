import {TestBed} from "@angular/core/testing";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HttpClientErrorHandler} from "./http-client-error-handler";
import SpyObj = jasmine.SpyObj;
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import createSpyObj = jasmine.createSpyObj;

describe("HttpClientErrorHandler", () => {
  let httpClientErrorHandler: HttpClientErrorHandler
  let snackbar: SpyObj<MatSnackBar>
  let dialog: SpyObj<MatDialog>

  beforeAll(() => {
    snackbar = createSpyObj(["open"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      providers: [
        HttpClientTestingModule,
        {provide: MatSnackBar, useValue: snackbar},
        {provide: MatDialog, useValue: dialog}
      ]
    })
    httpClientErrorHandler = TestBed.inject(HttpClientErrorHandler)
  })

  it('should be created', () => {
    expect(httpClientErrorHandler).toBeTruthy()
  });
})
