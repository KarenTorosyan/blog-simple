import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostCreateComponent} from './post-create.component';
import {MatStepperModule} from "@angular/material/stepper";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {Component, Injectable, Input} from "@angular/core";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserPublisher} from "../../../user/service/user-publisher";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {FileUploadService} from "../../../../shared/service/file-upload/file-upload.service";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-root-container",
  template: `<ng-content></ng-content>`
})
class RootContainerComponent {
}

@Component({
  selector: "ckeditor",
  template: ``
})
class CkeditorComponent {
  @Input() editor: any
  @Input() formControl: any
  @Input() data: any
  @Input() disabled: any
}

@Injectable()
class FileUploadServiceStub {
}

describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>
  let postService: SpyObj<PostService>
  let snackbar: SpyObj<MatSnackBar>
  let userPublisher: SpyObj<UserPublisher>
  let routerHarness: RouterTestingHarness

  beforeEach(async () => {
    postService = createSpyObj(["createPost"])
    snackbar = createSpyObj(["open"])
    userPublisher = createSpyObj(["getUser"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "post", children: [{path: "write", component: PostCreateComponent}]}]),
        MatStepperModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [
        PostCreateComponent,
        RootContainerComponent,
        CkeditorComponent
      ],
      providers: [
        {provide: PostService, useValue: postService},
        {provide: MatSnackBar, useValue: snackbar},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: FileUploadService, useValue: FileUploadServiceStub}
      ]
    });
    fixture = TestBed.createComponent(PostCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/write")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
