import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ResourceNotFoundComponent} from './resource-not-found.component';
import {MatCardModule} from "@angular/material/card";
import {Component} from "@angular/core";

@Component({
  selector: "app-root-container",
  template: "<ng-content></ng-content>"
})
class RootContainerComponent {
}

describe('ResourceNotFoundComponent', () => {
  let component: ResourceNotFoundComponent;
  let fixture: ComponentFixture<ResourceNotFoundComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatCardModule
      ],
      declarations: [
        ResourceNotFoundComponent,
        RootContainerComponent
      ]
    });
    fixture = TestBed.createComponent(ResourceNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render content', () => {
    expect(fixture.nativeElement.querySelector("#content").textContent)
      .toContain("Resource not found!")
  });
});
