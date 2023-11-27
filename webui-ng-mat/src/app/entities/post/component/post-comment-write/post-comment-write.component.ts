import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl, Validators} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-comment-write',
  templateUrl: './post-comment-write.component.html',
  styleUrls: ['./post-comment-write.component.scss']
})
export class PostCommentWriteComponent implements OnDestroy {

  @Input() postId: string | null = null

  commentControl = new FormControl("", [Validators.maxLength(1000)]);

  @Output() reloadPostComments = new EventEmitter()

  subs: Subscription[] = []

  constructor(private postService: PostService,
              private snackbar: MatSnackBar) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  publishComment() {
    this.subs.push(this.postService.addComment(this.postId!, {
      content: this.commentControl.value!,
      parentId: null
    }).subscribe(() => {
      this.snackbar.open("Comment published", undefined, {duration: 2500})
      this.commentControl.setValue("")
      this.reloadPostComments.emit()
    }))
  }
}
