import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDeleteDialogComponent } from './post-delete-dialog.component';
import SpyObj = jasmine.SpyObj;
import {PostService} from "../../service/post.service";
import createSpyObj = jasmine.createSpyObj;
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

describe('PostDeleteDialogComponent', () => {
  let component: PostDeleteDialogComponent;
  let fixture: ComponentFixture<PostDeleteDialogComponent>;
  const dialogData = {postId: "1"}
  let postService: SpyObj<PostService>

  beforeEach(() => {
    postService = createSpyObj(["deletePost"])
    TestBed.configureTestingModule({
      declarations: [PostDeleteDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: dialogData},
        {provide: PostService, useValue: postService}
      ]
    });
    fixture = TestBed.createComponent(PostDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
