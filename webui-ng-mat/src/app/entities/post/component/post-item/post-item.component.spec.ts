import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostItemComponent } from './post-item.component';
import {MatCardModule} from "@angular/material/card";
import {NgOptimizedImage} from "@angular/common";
import {Component, Input} from "@angular/core";

@Component({
  selector: "ckeditor",
  template: ``
})
class CkeditorComponent {
  @Input() editor: any
  @Input() data: any
  @Input() disabled: any
}

describe('PostItemComponent', () => {
  let component: PostItemComponent;
  let fixture: ComponentFixture<PostItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        NgOptimizedImage
      ],
      declarations: [
        PostItemComponent,
        CkeditorComponent
      ]
    });
    fixture = TestBed.createComponent(PostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
