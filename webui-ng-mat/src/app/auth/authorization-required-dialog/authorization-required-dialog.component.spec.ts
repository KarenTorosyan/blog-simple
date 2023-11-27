import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AuthorizationRequiredDialogComponent} from './authorization-required-dialog.component';
import {AuthService} from "../auth.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('AuthorizationRequiredDialogComponent', () => {
  let component: AuthorizationRequiredDialogComponent;
  let fixture: ComponentFixture<AuthorizationRequiredDialogComponent>;
  let authService: SpyObj<AuthService>

  beforeEach(() => {
    authService = createSpyObj(["login"])
    TestBed.configureTestingModule({
      declarations: [AuthorizationRequiredDialogComponent],
      providers: [
        {provide: AuthService, useValue: authService}
      ]
    });
    fixture = TestBed.createComponent(AuthorizationRequiredDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(fixture.nativeElement.querySelector("#title").textContent)
      .toEqual("Authorization Required")
  });

  it('should render content', () => {
    expect(fixture.nativeElement.querySelector("#content").textContent)
      .toContain("This request requires you to authorize")
  });

  it('should login on click \'Login\'', () => {
    fixture.nativeElement.querySelector("#loginBtn")
      .dispatchEvent(new Event("click"))
    expect(authService.login)
      .toHaveBeenCalled()
  });
});
