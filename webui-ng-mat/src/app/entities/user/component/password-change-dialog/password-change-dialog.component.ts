import {Component, Inject, OnDestroy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from "@angular/forms";
import {UserService} from "../../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

export const passwordConfirmValidator: ValidatorFn = (formGroup: AbstractControl) => {
  const confirmNewPassword = formGroup.get("confirmNew")
  const newPassword = formGroup.get("new")
  return confirmNewPassword && newPassword && confirmNewPassword.value === newPassword.value ?
    null : {"newPasswordNotConfirm": true}
}

@Component({
  selector: 'app-password-change-dialog',
  templateUrl: './password-change-dialog.component.html',
  styleUrls: ['./password-change-dialog.component.scss']
})
export class PasswordChangeDialogComponent implements OnDestroy {

  passwordFormGroup = new FormGroup({
    current: new FormControl("", [Validators.required]),
    new: new FormControl("", [Validators.required,
      Validators.minLength(6), Validators.maxLength(20)
    ]),
    confirmNew: new FormControl("", [Validators.required])
  }, {validators: passwordConfirmValidator})

  passwordHidden = true

  subs: Subscription[] = []

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private userService: UserService,
              private snackbar: MatSnackBar) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  togglePasswordVisibility() {
    this.passwordHidden = !this.passwordHidden
  }

  changePassword() {
    const userId = this.data['userId']
    if (userId) {
      this.subs.push(this.userService.changePassword(userId, {
        current: this.passwordFormGroup.value.current!,
        new: this.passwordFormGroup.value.new!,
        confirmNew: this.passwordFormGroup.value.confirmNew!
      }).subscribe(() => this.snackbar.open("Password changed",
        undefined, {duration: 2500})))
    }
  }
}
