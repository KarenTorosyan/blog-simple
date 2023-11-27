import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfilePostsComponent} from './profile-posts.component';
import {User} from "../../model";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {Component, Input} from "@angular/core";
import {UserPublisher} from "../../service/user-publisher";
import {of} from "rxjs";
import {UserService} from "../../service/user.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: "app-post-list",
  template: ``
})
class PostListComponent {
  @Input() withAuthors: boolean = false
  @Input() byAuthor: string | null = null
  @Input() pageNumQueryParam: string | null = null
  @Input() sortQueryParam: string | null = null
  @Input() searchQueryParam: string | null = null
}

describe('ProfilePostsComponent', () => {
  let component: ProfilePostsComponent;
  let fixture: ComponentFixture<ProfilePostsComponent>;
  let routerHarness: RouterTestingHarness
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  const userPublisherData = {} as User

  beforeEach(async () => {
    userService = createSpyObj(["getById"])
    userPublisher = createSpyObj(["getUser"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "profile/:id",
          children: [{path: "posts", component: ProfilePostsComponent}]
        }]),
        MatCardModule
      ],
      declarations: [
        ProfilePostsComponent,
        PostListComponent
      ], providers: [
        {provide: UserService, useValue: userService},
        {provide: UserPublisher, useValue: userPublisher}
      ]
    });
    fixture = TestBed.createComponent(ProfilePostsComponent);
    component = fixture.componentInstance;
    userPublisher.getUser.and.returnValue(of(userPublisherData))
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/profile/1/posts")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
