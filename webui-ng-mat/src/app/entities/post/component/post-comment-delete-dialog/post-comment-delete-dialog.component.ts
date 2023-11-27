import {Component, Inject, OnDestroy} from '@angular/core';
import {PostService} from "../../service/post.service";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-comment-delete-dialog',
  templateUrl: './post-comment-delete-dialog.component.html',
  styleUrls: ['./post-comment-delete-dialog.component.scss']
})
export class PostCommentDeleteDialogComponent implements OnDestroy {

  postCommentDeleted = false

  subs: Subscription[] = []

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,
              private postService: PostService,
              private snackbar: MatSnackBar) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  deleteComment() {
    const commentId = this.data.commentId
    if (commentId) {
      this.subs.push(this.postService.deleteComment(commentId)
        .subscribe(() => {
          this.snackbar.open("Comment deleted", undefined, {duration: 2500})
          this.postCommentDeleted = true
        }))
    }
  }
}
