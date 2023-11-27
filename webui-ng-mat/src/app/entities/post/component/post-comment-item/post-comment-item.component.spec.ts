import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCommentItemComponent} from './post-comment-item.component';
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";
import {ReactiveFormsModule} from "@angular/forms"
import {PostService} from "../../service/post.service";
import {UserService} from "../../../user/service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('PostCommentItemComponent', () => {
  let component: PostCommentItemComponent;
  let fixture: ComponentFixture<PostCommentItemComponent>;
  let postService: SpyObj<PostService>
  let userService: SpyObj<UserService>
  let snackbar: SpyObj<MatSnackBar>
  let dialog: SpyObj<MatDialog>

  beforeEach(() => {
    postService = createSpyObj([
      "editComment",
      "getComment",
      "addComment",
      "getCommentChildren",
      "setCommentReaction",
      "deleteCommentReaction",
      "getCommentReactionDetails",
      "getCommentReactionOfCurrentSubject"
    ])
    userService = createSpyObj(["getByEmails"])
    snackbar = createSpyObj(["open"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule
      ],
      declarations: [PostCommentItemComponent],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: UserService, useValue: userService},
        {provide: MatSnackBar, useValue: snackbar},
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(PostCommentItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
