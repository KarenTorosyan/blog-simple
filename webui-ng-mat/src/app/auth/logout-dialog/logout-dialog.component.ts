import {Component} from '@angular/core';
import {AuthService} from "../auth.service";

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
  styleUrls: ['./logout-dialog.component.scss'],
})
export class LogoutDialogComponent {

  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
