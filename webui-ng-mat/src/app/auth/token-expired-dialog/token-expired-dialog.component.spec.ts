import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TokenExpiredDialogComponent} from './token-expired-dialog.component';
import {AuthService} from "../auth.service";
import {MatDialogRef} from "@angular/material/dialog";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {AppComponent} from "../../app.component";
import {UserPublisher} from "../../entities/user/service/user-publisher";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('TokenExpiredDialogComponent', () => {
  let component: TokenExpiredDialogComponent;
  let fixture: ComponentFixture<TokenExpiredDialogComponent>;
  let authService: SpyObj<AuthService>
  let dialogRef: SpyObj<MatDialogRef<TokenExpiredDialogComponent>>
  let userPublisher: SpyObj<UserPublisher>

  beforeEach(() => {
    authService = createSpyObj(["login"])
    dialogRef = createSpyObj(["afterClosed"])
    userPublisher = createSpyObj(["publish"])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([
          {path: "", component: AppComponent}
        ])],
      declarations: [TokenExpiredDialogComponent],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: MatDialogRef<TokenExpiredDialogComponent>, useValue: dialogRef},
        {provide: UserPublisher, useValue: userPublisher}
      ]
    });
    fixture = TestBed.createComponent(TokenExpiredDialogComponent);
    component = fixture.componentInstance;
    dialogRef.afterClosed.and.returnValue(of())
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(dialogRef.afterClosed).toHaveBeenCalled()
  });

  it('should render title', () => {
    expect(fixture.nativeElement.querySelector("#title").textContent)
      .toEqual("Session Info")
  });

  it('should render content', () => {
    expect(fixture.nativeElement.querySelector("#content").textContent)
      .toContain("Your session has been expired")
  });

  it('should login on click \'Login\'', () => {
    fixture.nativeElement.querySelector("#loginBtn")
      .dispatchEvent(new Event("click"))
    expect(authService.login)
      .toHaveBeenCalled()
  });

  it('should clear current user data and close dialog', () => {
    fixture.nativeElement.querySelector("#closeBtn")
      .dispatchEvent(new Event("click"))
    expect(userPublisher.publish)
      .toHaveBeenCalledWith(null)
  });
});
