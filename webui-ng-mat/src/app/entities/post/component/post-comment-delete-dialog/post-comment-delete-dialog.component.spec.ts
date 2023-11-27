import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCommentDeleteDialogComponent } from './post-comment-delete-dialog.component';
import SpyObj = jasmine.SpyObj;
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import createSpyObj = jasmine.createSpyObj;

describe('PostCommentDeleteDialogComponent', () => {
  let component: PostCommentDeleteDialogComponent;
  let fixture: ComponentFixture<PostCommentDeleteDialogComponent>;
  let dialogData = {commentId: "1"}
  let postService: SpyObj<PostService>
  let snackbar: SpyObj<MatSnackBar>

  beforeEach(() => {
    postService = createSpyObj(["deleteComment"])
    snackbar = createSpyObj(["open"])
    TestBed.configureTestingModule({
      declarations: [PostCommentDeleteDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: dialogData},
        {provide: PostService, useValue: postService},
        {provide: MatSnackBar, useValue: snackbar}
      ]
    });
    fixture = TestBed.createComponent(PostCommentDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
