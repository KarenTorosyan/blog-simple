import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {CkeditorFileUploadAdapter} from "../../../../shared/service/ckeditor/ckeditor-file-upload-adapter";
import {FileUploadService} from "../../../../shared/service/file-upload/file-upload.service";
import Editor from "../../../../../../ckeditor-custom-build/build/ckeditor";
import {UserPublisher} from "../../../user/service/user-publisher";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})
export class PostCreateComponent implements OnDestroy {

  postFormGroup = new FormGroup({
    content: new FormControl("", [Validators.required, Validators.maxLength(200000)]),
    previewContent: new FormControl("", [Validators.required, Validators.maxLength(20000)])
  })

  editor = Editor

  subs: Subscription[] = []

  constructor(private postService: PostService,
              private snackbar: MatSnackBar,
              private router: Router,
              private userPublisher: UserPublisher,
              private fileUploadService: FileUploadService) {
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  createPost() {
    this.subs.push(this.postService.createPost({
      content: this.postFormGroup.value.content!,
      previewContent: this.postFormGroup.value.previewContent!
    }).subscribe(() => {
      this.snackbar.open("Post created", undefined, {duration: 2000})
      this.navigateAfterCreate()
    }))
  }

  navigateAfterCreate() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => {
        this.router.navigate(["/user", 'profile', user!.id]).then()
      }))
  }

  editorReady(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      new CkeditorFileUploadAdapter(loader, this.fileUploadService)
  }
}
