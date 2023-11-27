import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCommentListComponent} from './post-comment-list.component';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {Component, EventEmitter, Input, Output} from "@angular/core";
import {PostComment, PostCommentReaction, PostCommentReactionDetails} from "../../model";
import {User} from "../../../user/model";
import {PostService} from "../../service/post.service";
import {UserService} from "../../../user/service/user.service";
import {UserPublisher} from "../../../user/service/user-publisher";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-post-comment-item",
  template: ``
})
class PostCommentItemComponent {
  @Input() comment: PostComment | null = null
  @Input() commentSubjects: Map<string, User> = new Map<string, User>()
  @Input() withSubjects = false
  @Input() reactionDetails = new Map<string, PostCommentReactionDetails[]>()
  @Input() currentUser: User | null = null
  @Input() currentUserReaction = new Map<string, PostCommentReaction>
  @Output() reloadComments = new EventEmitter()
}

describe('PostCommentListComponent', () => {
  let component: PostCommentListComponent;
  let fixture: ComponentFixture<PostCommentListComponent>;
  let postService: SpyObj<PostService>
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let routerHarness: RouterTestingHarness

  beforeEach(async () => {
    postService = createSpyObj([
      "getCommentsBySubject",
      "getComments",
      "getCommentReactionDetails",
      "getCommentReactionsOfSubject"
    ])
    userService = createSpyObj(["getByEmails"])
    userPublisher = createSpyObj(["getUser"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "post", children: [
            {path: "list", component: PostCommentListComponent}]
        }]),
        MatInputModule,
        MatSelectModule,
        MatPaginatorModule
      ],
      declarations: [
        PostCommentListComponent,
        PostCommentItemComponent
      ],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: UserService, useValue: userService},
        {provide: UserPublisher, useValue: userPublisher}
      ]
    })
    fixture = TestBed.createComponent(PostCommentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/list")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
