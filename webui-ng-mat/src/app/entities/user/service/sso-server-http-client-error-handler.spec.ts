import {TestBed} from "@angular/core/testing";
import {SsoServerHttpClientErrorHandler} from "./sso-server-http-client-error-handler";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("SsoServerHttpClientErrorHandler", () => {
  let ssoServerHttpClientErrorHandler: SsoServerHttpClientErrorHandler
  let snackbar: SpyObj<MatSnackBar>
  let dialog: SpyObj<MatDialog>

  beforeAll(() => {
    snackbar = createSpyObj(["open"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      providers: [
        SsoServerHttpClientErrorHandler,
        {provide: MatSnackBar, useValue: snackbar},
        {provide: MatDialog, useValue: dialog}
      ]
    })
    ssoServerHttpClientErrorHandler = TestBed.inject(SsoServerHttpClientErrorHandler)
  })

  it('should be created', () => {
    expect(ssoServerHttpClientErrorHandler).toBeTruthy()
  });
})
