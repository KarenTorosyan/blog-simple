import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LogoutDialogComponent} from './logout-dialog.component';
import {AuthService} from "../auth.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('LogoutDialogComponent', () => {
  let component: LogoutDialogComponent;
  let fixture: ComponentFixture<LogoutDialogComponent>;
  let authService: SpyObj<AuthService>

  beforeEach(() => {
    authService = createSpyObj(AuthService, ["logout"])
    TestBed.configureTestingModule({
      declarations: [LogoutDialogComponent],
      providers: [
        {provide: AuthService, useValue: authService}
      ]
    });
    fixture = TestBed.createComponent(LogoutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title', () => {
    expect(fixture.nativeElement.querySelector("#title").textContent)
      .toEqual("Logout")
  });

  it('should render content', () => {
    expect(fixture.nativeElement.querySelector("#content").textContent)
      .toContain("Do you want to logout?")
  });

  it('should logout on click \'Logout\'', () => {
    fixture.nativeElement.querySelector("#logoutBtn")
      .dispatchEvent(new Event("click"))
    expect(authService.logout)
      .toHaveBeenCalled()
  });
});
