import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import Editor from "../../../../../../ckeditor-custom-build/build/ckeditor";
import {PostService} from "../../service/post.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ActivatedRoute, Router} from "@angular/router";
import {FileUploadService} from "../../../../shared/service/file-upload/file-upload.service";
import {CkeditorFileUploadAdapter} from "../../../../shared/service/ckeditor/ckeditor-file-upload-adapter";
import {Post} from "../../model";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.scss']
})
export class PostEditComponent implements OnInit, OnDestroy {

  post: Post | null = null

  editor = Editor

  postFormGroup = new FormGroup({
    content: new FormControl("",
      [Validators.required, Validators.maxLength(200000)]),
    previewContent: new FormControl("",
      [Validators.required, Validators.maxLength(20000)])
  })

  postEditor = Editor

  subs: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private postService: PostService,
              private snackbar: MatSnackBar,
              private router: Router,
              private fileUploadService: FileUploadService) {
  }

  ngOnInit() {
    this.subs.push(this.route.paramMap.subscribe(map => {
      this.loadPostById(map.get("postId")!)
    }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadPostById(id: string) {
    this.subs.push(this.postService.getPostById(id)
      .subscribe(post => {
        this.post = post
        this.postFormGroup.setValue({
          content: post.content,
          previewContent: post.previewContent
        })
      }))
  }

  editPost(id: string) {
    this.subs.push(this.postService.editPost(id, {
      content: this.postFormGroup.value.content!,
      previewContent: this.postFormGroup.value.previewContent!
    }).subscribe(() => {
      this.snackbar.open("Post updated", undefined, {duration: 2000})
      this.router.navigate(["/post", 'details', id]).then()
    }))
  }

  editorReady(editor: Editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) =>
      new CkeditorFileUploadAdapter(loader, this.fileUploadService)
  }
}
