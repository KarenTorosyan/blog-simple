import {Component, OnInit} from '@angular/core';
import {AuthService} from "../auth.service";
import {MatDialogRef} from "@angular/material/dialog";
import {UserPublisher} from "../../entities/user/service/user-publisher";

@Component({
  selector: 'app-token-expired-dialog',
  templateUrl: './token-expired-dialog.component.html',
  styleUrls: ['./token-expired-dialog.component.scss']
})
export class TokenExpiredDialogComponent implements OnInit {

  constructor(private authService: AuthService,
              private dialogRef: MatDialogRef<TokenExpiredDialogComponent>,
              private userPublisher: UserPublisher) {
  }

  ngOnInit() {
    this.dialogRef.afterClosed()
      .subscribe(() => this.clearCurrentUserData())
  }

  login() {
    this.authService.login()
  }

  clearCurrentUserData() {
    this.userPublisher.publish(null)
  }
}

