import {Component, Inject, OnDestroy} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {PostService} from "../../service/post.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-delete-dialog',
  templateUrl: './post-delete-dialog.component.html',
  styleUrls: ['./post-delete-dialog.component.scss']
})
export class PostDeleteDialogComponent implements OnDestroy {

  postId: string | null = null

  isDeleted = false

  subs: Subscription[] = []

  constructor(@Inject(MAT_DIALOG_DATA) data: any,
              private postService: PostService) {
    this.postId = data.id
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  delete() {
    if (this.postId) {
      this.subs.push(this.postService.deletePost(this.postId)
        .subscribe(() => this.isDeleted = true))
    }
  }
}
