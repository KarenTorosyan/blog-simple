import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDrawer} from "@angular/material/sidenav";
import {User} from "../../entities/user/model";
import {UserPublisher} from "../../entities/user/service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import {LogoutDialogComponent} from "../../auth/logout-dialog/logout-dialog.component";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  @ViewChild("drawer") drawer!: MatDrawer

  currentUser: User | null = null

  constructor(private authService: AuthService,
              private userPublisher: UserPublisher,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.userPublisher.getUser()
      .subscribe(user => this.currentUser = user)
  }

  login() {
    this.authService.login()
  }

  openLogoutDialog(): void {
    this.dialog.open(LogoutDialogComponent, {
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
    });
  }

  toggleSidebar() {
    this.drawer.toggle()
      .then()
  }
}
