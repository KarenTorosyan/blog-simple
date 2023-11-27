import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PostEditComponent} from './post-edit.component';
import {Component, Injectable, Input} from "@angular/core";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {MatStepperModule} from "@angular/material/stepper";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FileUploadService} from "../../../../shared/service/file-upload/file-upload.service";
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

describe('PostEditComponent', () => {
  let component: PostEditComponent;
  let fixture: ComponentFixture<PostEditComponent>;
  let routerHarness: RouterTestingHarness
  let postService: SpyObj<PostService>
  let snackbar: SpyObj<MatSnackBar>

  beforeEach(async () => {
    postService = createSpyObj([
      "getPostById",
      "editPost"
    ])
    snackbar = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: "post", children: [{path: "edit/:id", component: PostEditComponent}]}
        ]),
        MatStepperModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatIconModule
      ],
      declarations: [
        PostEditComponent,
        RootContainerComponent,
        CkeditorComponent
      ], providers: [
        {provide: PostService, useValue: postService},
        {provide: MatSnackBar, useValue: snackbar},
        {provide: FileUploadService, useValue: FileUploadServiceStub}
      ]
    });
    fixture = TestBed.createComponent(PostEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/post/edit/1")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
