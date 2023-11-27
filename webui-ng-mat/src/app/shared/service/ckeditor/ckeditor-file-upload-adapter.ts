import {FileUploadService} from "../file-upload/file-upload.service";

export class CkeditorFileUploadAdapter {

  constructor(private loader: any,
              private fileUploadService: FileUploadService) {
  }

  upload() {
    return this.loader.file.then((file: File | null) => {
      return new Promise((resolve, reject) => {
        if (file) {
          this.fileUploadService.upload(file).subscribe({
            next: file => resolve({default: file.url}),
            error: err => reject(err.error.message)
          })
        }
      })
    })
  }
}
