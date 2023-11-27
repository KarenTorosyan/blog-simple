import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-authorization-required-dialog',
  templateUrl: './authorization-required-dialog.component.html',
  styleUrls: ['./authorization-required-dialog.component.scss']
})
export class AuthorizationRequiredDialogComponent {

  constructor(private authService: AuthService) {
  }

  login() {
    this.authService.login()
  }
}
