import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ImageCropperDialogComponent} from './image-cropper-dialog.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {ImageCropperModule} from "ngx-image-cropper";

describe('ImageCropperDialogComponent', () => {
  let component: ImageCropperDialogComponent;
  let fixture: ComponentFixture<ImageCropperDialogComponent>;
  let dialog: SpyObj<MatDialogRef<ImageCropperDialogComponent>>
  const dialogData = {imageMaxWidth: 600, imageMaxHeight: 600}

  beforeEach(() => {
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [ImageCropperModule],
      declarations: [ImageCropperDialogComponent],
      providers: [
        {provide: MatDialogRef<ImageCropperDialogComponent>, useValue: dialog},
        {provide: MAT_DIALOG_DATA, useValue: dialogData}
      ]
    });
    fixture = TestBed.createComponent(ImageCropperDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
