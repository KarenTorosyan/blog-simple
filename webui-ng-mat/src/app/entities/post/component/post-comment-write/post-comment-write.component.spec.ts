import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCommentWriteComponent} from './post-comment-write.component';
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {PostCreateComponent} from "../post-create/post-create.component";
import {MatInputModule} from "@angular/material/input";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PostCommentWriteComponent', () => {
  let component: PostCommentWriteComponent;
  let fixture: ComponentFixture<PostCommentWriteComponent>;
  let postService: SpyObj<PostService>
  let snackbar: SpyObj<MatSnackBar>
  let routerHarness: RouterTestingHarness

  beforeEach(async () => {
    postService = createSpyObj(["addComment"])
    snackbar = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "post", children: [
            {path: "write", component: PostCommentWriteComponent}]
        }]),
        MatInputModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ],
      declarations: [PostCommentWriteComponent],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: MatSnackBar, useValue: snackbar}
      ]
    });
    fixture = TestBed.createComponent(PostCommentWriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/write")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
