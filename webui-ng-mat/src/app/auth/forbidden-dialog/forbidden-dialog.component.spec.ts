import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ForbiddenDialogComponent} from './forbidden-dialog.component';

describe('ForbiddenDialogComponent', () => {
  let component: ForbiddenDialogComponent;
  let fixture: ComponentFixture<ForbiddenDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForbiddenDialogComponent]
    });
    fixture = TestBed.createComponent(ForbiddenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(fixture.nativeElement.querySelector("#title").textContent)
      .toEqual("Forbidden")
  });

  it('should render content', () => {
    expect(fixture.nativeElement.querySelector("#content").textContent)
      .toContain("You haven't enough access!")
  });
});
