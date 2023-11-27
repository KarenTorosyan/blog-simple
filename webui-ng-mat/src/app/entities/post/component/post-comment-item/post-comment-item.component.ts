import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {PostComment, PostCommentReaction, PostCommentReactionDetails} from "../../model";
import {User} from "../../../user/model";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {PostCommentDeleteDialogComponent} from "../post-comment-delete-dialog/post-comment-delete-dialog.component";
import {FormControl, Validators} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {UserService} from "../../../user/service/user.service";
import {Subscription} from "rxjs";
import {DateOfEntityPipe} from "../../../../shared/pipe/date-of-entity/date-of-entity.pipe";

@Component({
  selector: 'app-post-comment-item',
  templateUrl: './post-comment-item.component.html',
  styleUrls: ['./post-comment-item.component.scss']
})
export class PostCommentItemComponent implements OnDestroy {

  @Input() comment: PostComment | null = null
  @Input() commentSubjects: Map<string, User> = new Map<string, User>()
  @Input() withSubjects = true
  @Output() reloadComments = new EventEmitter()

  isVisibleEditCommentTextarea = false
  commentControl = new FormControl("", [Validators.required, Validators.maxLength(1000)])

  isVisibleReplyCommentTextarea = false
  isVisibleReplyAction = true
  viewCommentRepliesList = false
  commentReplyControl = new FormControl("", [Validators.required, Validators.maxLength(1000)])
  commentReplies: PostComment[] = []
  commentRepliesSubjects = new Map<string, User>()
  @Input() withReplyAction = true

  @Input() currentUser: User | null = null

  reactions = ["👍", "👎"]
  @Input() reactionDetails = new Map<string, PostCommentReactionDetails[]>()
  @Input() currentUserReaction = new Map<string, PostCommentReaction>
  @Input() canSetReaction = true

  @Input() withPostRouteLink = false

  subs: Subscription[] = []

  constructor(private postService: PostService,
              private userService: UserService,
              private snackbar: MatSnackBar,
              private dialog: MatDialog) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  get subject() {
    return this.commentSubjects.get(this.comment!.subject)!
  }

  loadPostComment() {
    this.subs.push(this.postService.getComment(this.comment!.postId, this.comment!.id)
      .subscribe(comment => this.comment = comment))
  }

  getCommentDate(comment: PostComment) {
    return new DateOfEntityPipe()
      .transform(comment.createdDate, comment.updatedDate)
  }

  toggleCommentEditTextarea() {
    this.isVisibleEditCommentTextarea = !this.isVisibleEditCommentTextarea
    if (this.isVisibleEditCommentTextarea) {
      this.commentControl.setValue(this.comment!.content)
      this.isVisibleReplyAction = false
    } else {
      this.isVisibleReplyAction = true
    }
  }

  editPostComment() {
    this.subs.push(this.postService.editComment(this.comment!.id, {
      content: this.commentControl.value!,
    }).subscribe(() => {
      this.loadPostComment()
      this.toggleCommentEditTextarea()
    }))
  }

  openCommentDeleteDialog() {
    const dialogRef = this.dialog.open(PostCommentDeleteDialogComponent, {
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: {
        commentId: this.comment!.id
      }
    })
    this.subs.push(dialogRef.afterClosed().subscribe(() => {
      if (dialogRef.componentInstance.postCommentDeleted) {
        this.reloadComments.emit()
      }
    }))
  }

  toggleReplyPostCommentActionVisibility() {
    this.isVisibleReplyCommentTextarea = !this.isVisibleReplyCommentTextarea
  }

  replyPostComment(replyTo: string) {
    this.subs.push(this.postService.addComment(this.comment!.postId, {
      content: this.commentReplyControl.value!,
      parentId: replyTo
    }).subscribe(() => {
      this.snackbar.open("Comment published", undefined, {duration: 2500})
      this.toggleReplyPostCommentActionVisibility()
      this.reloadComments.emit()
    }))
  }

  loadCommentReplies(commentId: string) {
    this.viewCommentRepliesList = true
    this.subs.push(this.postService.getCommentChildren(commentId)
      .subscribe(children => {
        this.commentReplies = children
        this.loadCommentRepliesSubjects(this.commentReplies)
      }))
  }

  hideCommentReplies() {
    this.viewCommentRepliesList = false
    this.commentReplies = []
  }

  loadCommentRepliesSubjects(postComments: PostComment[]) {
    const emails = postComments.map(comment => comment.subject)
    this.subs.push(this.userService.getAllByEmail(new Set(emails))
      .subscribe(postCommentsPage => {
        this.commentRepliesSubjects.clear()
        postCommentsPage.content.forEach(user => {
          this.commentRepliesSubjects.set(user.email.address, user)
        })
      }))
  }

  getReactionsCount(commentId: string, reaction: string) {
    return this.reactionDetails.get(commentId)?.find(details =>
      details.reaction === reaction)?.count || 0
  }

  setOrDeleteReaction(commentId: string, reaction: string) {
    if (this.canSetReaction) {
      if (this.currentUserHaveReaction(commentId, reaction)) {
        this.deleteReaction(commentId)
      } else {
        this.setReaction(commentId, reaction)
      }
    }
  }

  setReaction(commentId: string, reaction: string) {
    this.subs.push(this.postService.setCommentReaction(commentId, {
      reaction: reaction
    }).subscribe(() => {
      this.reloadReactionDetails(commentId)
      this.reloadCurrentUserReactions(commentId)
    }))
  }

  deleteReaction(commentId: string) {
    this.subs.push(this.postService.deleteCommentReaction(commentId)
      .subscribe(() => {
        this.reloadReactionDetails(commentId)
        this.reloadCurrentUserReactions(commentId)
      }))
  }

  reloadReactionDetails(commentId: string) {
    this.subs.push(this.postService.getCommentReactionDetails(new Set(commentId))
      .subscribe(details => this.reactionDetails.set(commentId, details)))
  }

  reloadCurrentUserReactions(commentId: string) {
    this.subs.push(this.postService.getCommentReactionOfCurrentSubject(commentId)
      .subscribe({
        next: reaction => this.currentUserReaction.set(commentId, reaction),
        error: err => {
          if (err.status === 404) this.currentUserReaction.delete(commentId)
        }
      }))
  }

  currentUserHaveReaction(commentId: string, reaction: string): boolean {
    const userReaction = this.currentUserReaction.get(commentId)
    return userReaction != undefined && userReaction.reaction === reaction
  }
}
