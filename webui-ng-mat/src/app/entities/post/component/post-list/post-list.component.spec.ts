import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostListComponent} from './post-list.component';
import {Component, Input} from "@angular/core";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatIconModule} from "@angular/material/icon";
import {MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {Post} from "../../model";
import {User} from "../../../user/model";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import SpyObj = jasmine.SpyObj;
import {PostService} from "../../service/post.service";
import {UserService} from "../../../user/service/user.service";
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-root-container",
  template: `<ng-content></ng-content>`
})
class RootContainerComponent {
}

@Component({
  selector: "app-post-item",
  template: ``
})
class PostItemComponent {
  @Input() post: Post | null = null
  @Input() authors = new Map<string, User>
  @Input() withAuthors: boolean = true
}

describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let routerHarness: RouterTestingHarness
  let postService: SpyObj<PostService>
  let userService: SpyObj<UserService>

  beforeEach(async () => {
    postService = createSpyObj(["getPosts"])
    userService = createSpyObj(["getByEmails"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: "post", children: [{path: "list", component: PostListComponent}]}
        ]),
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatPaginatorModule,
        ReactiveFormsModule
      ],
      declarations: [
        PostListComponent,
        RootContainerComponent,
        PostItemComponent
      ],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: UserService, useValue: userService}
      ]
    });
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/list")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
