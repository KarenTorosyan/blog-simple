import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model";
import {ActivatedRoute} from "@angular/router";
import {UserPublisher} from "../../service/user-publisher";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user: User | null = null

  currentUser: User | null = null

  subs: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private userPublisher: UserPublisher) {
  }

  ngOnInit() {
    this.loadUser()
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadUser() {
    this.subs.push(this.route.paramMap.subscribe(map => {
      this.subs.push(this.userService.getById(map.get("userId")!)
        .subscribe(user => {
          this.user = user
          this.loadCurrentUser()
        }))
    }))
  }

  loadCurrentUser() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => {
        this.currentUser = user
        if (user && user.id === this.user!.id) {
          this.user = user
        }
      }))
  }
}
