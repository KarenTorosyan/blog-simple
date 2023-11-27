import {Component, Inject} from '@angular/core';
import {ImageCroppedEvent} from "ngx-image-cropper";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-image-cropper-dialog',
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.scss']
})
export class ImageCropperDialogComponent {

  originalImage: File | undefined = undefined;

  imageMaxWidth: number = 1000

  imageMaxHeight: number = 1000

  croppedImage: File | null = null

  constructor(public dialogRef: MatDialogRef<ImageCropperDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) {
    this.originalImage = data.originalImage
    if (data.imageMaxWidth) {
      this.imageMaxWidth = data.imageMaxWidth
    }
    if (data.imageMaxHeight) {
      this.imageMaxHeight = data.imageMaxHeight
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    if (event.blob) {
      this.croppedImage = new File([event.blob],
        this.originalImage!.name, {type: event.blob.type});
    }
  }

  apply() {
    this.dialogRef.close(this.croppedImage)
  }
}
