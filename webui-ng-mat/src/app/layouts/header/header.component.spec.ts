import {ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from './header.component';
import {Component} from "@angular/core";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import SpyObj = jasmine.SpyObj;
import {AuthService} from "../../auth/auth.service";
import createSpyObj = jasmine.createSpyObj;
import {UserPublisher} from "../../entities/user/service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";

@Component({
  selector: "app-root-container",
  template: `
    <ng-content></ng-content>`
})
class RootContainer {
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: SpyObj<AuthService>
  let userPublisher: SpyObj<UserPublisher>
  let dialog: SpyObj<MatDialog>

  beforeEach(() => {
    authService = createSpyObj([
      "onLogin",
      "login"
    ])
    userPublisher = createSpyObj(["getUser"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        MatToolbarModule,
        MatIconModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [
        HeaderComponent,
        RootContainer
      ],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService.onLogin.and.returnValue(of(false))
    userPublisher.getUser.and.returnValue(of(null))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
