import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostDetailsComponent} from './post-details.component';
import {Component, Input} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {PostService} from "../../service/post.service";
import {UserService} from "../../../user/service/user.service";
import {UserPublisher} from "../../../user/service/user-publisher";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-root-container",
  template: `<ng-content></ng-content>`
})
class RootContainerComponent {
}

@Component({
  selector: "app-post-comment-write",
  template: ``
})
class PostCommentWriteContainer {
  @Input() postId: string | null = null
}

@Component({
  selector: "ckeditor",
  template: ``
})
class CkeditorComponent {
  @Input() editor: any
  @Input() data: any
  @Input() disabled: any
}

describe('PostDetailsComponent', () => {
  let component: PostDetailsComponent;
  let fixture: ComponentFixture<PostDetailsComponent>;
  let postService: SpyObj<PostService>
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let snackbar: SpyObj<MatSnackBar>
  let dialog: SpyObj<MatDialog>
  let routerHarness: RouterTestingHarness

  beforeEach(async () => {
    postService = createSpyObj([
      "getPostById",
      "getReactionDetails",
      "setReaction",
      "deleteReaction",
      "getReactionOfCurrentSubject"
    ])
    userService = createSpyObj(["getByEmail"])
    userPublisher = createSpyObj(["getUser"])
    snackbar = createSpyObj(["open"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: "post", children: [{path: "details/:id", component: PostDetailsComponent}]}
        ]),
        MatCardModule,
        NgOptimizedImage
      ],
      declarations: [
        PostDetailsComponent,
        RootContainerComponent,
        PostCommentWriteContainer,
        CkeditorComponent
      ],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: UserService, useValue: userService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: MatSnackBar, useValue: snackbar},
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(PostDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/details/1")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
