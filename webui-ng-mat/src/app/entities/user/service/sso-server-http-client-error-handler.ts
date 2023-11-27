import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {AuthorizationRequiredDialogComponent} from "../../../auth/authorization-required-dialog/authorization-required-dialog.component";
import {throwError} from "rxjs";
import {ForbiddenDialogComponent} from "../../../auth/forbidden-dialog/forbidden-dialog.component";

interface SsoServerError {
  uri: string
  reason: string | Array<{ [key: string]: string }>
  date: Date
}

@Injectable({
  providedIn: "root"
})
export class SsoServerHttpClientErrorHandler {

  constructor(private snackbar: MatSnackBar,
              private dialog: MatDialog) {
  }

  closeSnackbarText = "OK"

  handle(response: HttpErrorResponse) {
    switch (response.status) {
      case 400:
        const error = response.error as SsoServerError
        if (error.reason instanceof Array) {
          error.reason.forEach(map => Object.values(map)
            .forEach(message => this.snackbar.open(message || response.statusText, this.closeSnackbarText)))
        } else {
          this.snackbar.open(response.error.reason || response.statusText, this.closeSnackbarText)
        }
        break
      case 401:
        this.dialog.open(AuthorizationRequiredDialogComponent, {enterAnimationDuration: "100ms", exitAnimationDuration: "100ms"})
        break
      case 403:
        this.dialog.open(ForbiddenDialogComponent, {enterAnimationDuration: "100ms", exitAnimationDuration: "100ms"})
        break
      case 404:
        break
      default:
        this.snackbar.open(response.statusText, this.closeSnackbarText)
    }
    return throwError(() => response)
  }
}
