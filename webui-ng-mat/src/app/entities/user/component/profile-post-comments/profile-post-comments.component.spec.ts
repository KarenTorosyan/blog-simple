import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilePostCommentsComponent} from './profile-post-comments.component';
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {User} from "../../model";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatPaginatorModule} from "@angular/material/paginator";
import {ReactiveFormsModule} from "@angular/forms";
import {UserPublisher} from "../../service/user-publisher";
import {PostService} from "../../../post/service/post.service";
import {Component, Input} from "@angular/core";
import {PostComment, PostCommentReactionDetails} from "../../../post/model";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {of} from "rxjs";
import {UserService} from "../../service/user.service";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: "app-post-comment-item",
  template: ``
})
class PostCommentItemComponent {
  @Input() comment: PostComment | null = null
  @Input() withSubjects: boolean = false
  @Input() withReplyAction: boolean = false
  @Input() currentUser: User | null = null
  @Input() reactionDetails = new Map<string, PostCommentReactionDetails[]>
  @Input() withPostRouteLink: boolean = true
}

describe('ProfilePostCommentsComponent', () => {
  let component: ProfilePostCommentsComponent;
  let fixture: ComponentFixture<ProfilePostCommentsComponent>;
  let routerHarness: RouterTestingHarness
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let postService: SpyObj<PostService>
  const userPublisherData = {} as User

  beforeEach(async () => {
    userService = createSpyObj(["getById"])
    userPublisher = createSpyObj(["getUser"])
    postService = createSpyObj([
      "getCommentsBySubject",
      "getCommentReactionDetails"
    ])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "profile/:id",
          children: [{path: "comments", component: ProfilePostCommentsComponent}]
        }]),
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatPaginatorModule
      ],
      declarations: [
        ProfilePostCommentsComponent,
        PostCommentItemComponent
      ],
      providers: [
        {provide: UserService, useValue: UserService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: PostService, useValue: postService}
      ]
    });
    fixture = TestBed.createComponent(ProfilePostCommentsComponent);
    component = fixture.componentInstance;
    userPublisher.getUser.and.returnValue(of(userPublisherData))
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/profile/1/comments")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
