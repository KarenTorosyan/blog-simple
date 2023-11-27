import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {throwError} from "rxjs";

export interface FileUploadServerError {
  error: { message: string }
}

@Injectable({
  providedIn: "root"
})
export class FileUploadServerHttpClientErrorHandler {

  constructor(private snackbar: MatSnackBar) {
  }

  closeSnackbarText = "OK"

  handle(response: HttpErrorResponse) {
    switch (response.status) {
      case 400:
        const error = response.error as FileUploadServerError
        this.snackbar.open(error.error.message || response.statusText, this.closeSnackbarText)
        break
      default:
        this.snackbar.open(response.statusText, this.closeSnackbarText)
    }
    return throwError(() => response)
  }
}
