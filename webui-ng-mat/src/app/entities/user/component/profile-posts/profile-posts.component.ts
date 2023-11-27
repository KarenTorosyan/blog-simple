import {Component, OnDestroy, OnInit} from '@angular/core';
import {User} from "../../model";
import {ActivatedRoute} from "@angular/router";
import {UserPublisher} from "../../service/user-publisher";
import {Subscription} from "rxjs";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-profile-posts',
  templateUrl: './profile-posts.component.html',
  styleUrls: ['./profile-posts.component.scss']
})
export class ProfilePostsComponent implements OnInit, OnDestroy {

  user: User | null = null

  currentUser: User | null = null

  subs: Subscription[] = []

  postsLength = 0
  postsLengthLoaded = false

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private userPublisher: UserPublisher) {
  }

  ngOnInit() {
    this.loadUser()
    this.loadCurrentUser()
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadUser() {
    if (this.route.parent) {
      this.subs.push(this.route.parent.paramMap
        .subscribe(map => {
          this.subs.push(this.userService.getById(map.get("userId")!)
            .subscribe(user => this.user = user))
        }))
    }
  }

  loadCurrentUser() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => this.currentUser = user))
  }

  initPostsLength(length: number) {
    this.postsLength = length
    this.postsLengthLoaded = true
  }
}
