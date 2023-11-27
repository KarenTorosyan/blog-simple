import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {UserPublisher} from "../../entities/user/service/user-publisher";
import {User} from "../../entities/user/model";
import {MatDialog} from "@angular/material/dialog";
import {LogoutDialogComponent} from "../../auth/logout-dialog/logout-dialog.component";
import {AuthService} from "../../auth/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  @Output() toggleSidebar = new EventEmitter()

  currentUser: User | null = null

  subs: Subscription[] = []

  constructor(private authService: AuthService,
              private userPublisher: UserPublisher,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subs.push(this.authService.onLogin()
      .subscribe())
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => this.currentUser = user))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  login() {
    this.authService.login()
  }

  openLogoutDialog(): void {
    this.dialog.open(LogoutDialogComponent, {
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms"
    });
  }
}
