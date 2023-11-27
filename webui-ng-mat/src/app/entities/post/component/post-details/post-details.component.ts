import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post, PostReaction, PostReactionDetails} from "../../model";
import {PostService} from "../../service/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {User} from "../../../user/model";
import {UserService} from "../../../user/service/user.service";
import {MatDialog} from "@angular/material/dialog";
import {PostDeleteDialogComponent} from "../post-delete-dialog/post-delete-dialog.component";
import {UserPublisher} from "../../../user/service/user-publisher";
import {Subscription} from "rxjs";
import Editor from "../../../../../../ckeditor-custom-build/build/ckeditor";
import {DateOfEntityPipe} from "../../../../shared/pipe/date-of-entity/date-of-entity.pipe";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit, OnDestroy {

  post: Post | null = null

  author: User | null = null

  currentUser: User | null = null

  editor = Editor

  reactions = ["👍", "👎", "😀", "😈", "😂", "🥰", "😢"]
  reactionDetails: PostReactionDetails[] = []
  currentUserReaction: PostReaction | null = null

  subs: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private userService: UserService,
              private userPublisher: UserPublisher,
              private snackbar: MatSnackBar,
              private dialog: MatDialog,
              private router: Router) {
  }

  ngOnInit() {
    this.subs.push(this.route.paramMap.subscribe(map =>
      this.loadPostById(map.get("postId")!)))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadPostById(id: string) {
    this.subs.push(this.postService.getPostById(id)
      .subscribe(post => {
        this.post = post
        this.loadAuthor(post.author)
        this.loadReactionDetails(post.id)
        this.loadCurrentUser()
      }))
  }

  getPostDate(post: Post) {
    return new DateOfEntityPipe()
      .transform(post.createdDate, post.updatedDate)
  }

  loadAuthor(author: string) {
    this.subs.push(this.userService.getByEmail(author)
      .subscribe(user => this.author = user))
  }

  openPostDeleteDialog(id: string) {
    const dialogRef = this.dialog.open(PostDeleteDialogComponent, {
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: {
        id: id
      }
    })
    this.subs.push(dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.isDeleted) {
        this.snackbar.open("Post deleted", undefined, {duration: 2500})
        this.router.navigate(["/user", 'profile', this.author!.id]).then()
      }
    }))
  }

  loadCurrentUser() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => {
        this.currentUser = user
        this.loadCurrentUserReaction(this.post!.id)
      }))
  }

  loadReactionDetails(postId: string) {
    this.subs.push(this.postService.getReactionDetails(postId)
      .subscribe(details => {
        this.reactionDetails = details
      }))
  }

  getReactionCount(reaction: string) {
    return this.reactionDetails.find(details =>
      details.reaction === reaction)?.count || 0
  }

  setOrDeleteReaction(postId: string, reaction: string) {
    if (this.currentUserReaction && this.currentUserReaction.reaction === reaction) {
      this.deleteReaction(postId)
    } else {
      this.setReaction(postId, reaction)
    }
  }

  setReaction(postId: string, reaction: string) {
    this.subs.push(this.postService.setReaction(postId, {reaction: reaction})
      .subscribe(() => {
        this.loadReactionDetails(postId)
        this.loadCurrentUserReaction(postId)
      }))
  }

  deleteReaction(postId: string) {
    this.subs.push(this.postService.deleteReaction(postId)
      .subscribe(() => {
        this.currentUserReaction = null
        this.loadReactionDetails(postId)
      }))
  }

  loadCurrentUserReaction(postId: string) {
    if (this.currentUser) {
      this.subs.push(this.postService.getReactionOfCurrentSubject(postId)
        .subscribe(reaction => this.currentUserReaction = reaction))
    }
  }
}
