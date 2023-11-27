import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {RouterTestingModule} from "@angular/router/testing";
import {AuthService} from "../../auth/auth.service";
import SpyObj = jasmine.SpyObj;
import {UserPublisher} from "../../entities/user/service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import createSpyObj = jasmine.createSpyObj;
import {of} from "rxjs";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let authService: SpyObj<AuthService>
  let userPublisher: SpyObj<UserPublisher>
  let dialog: SpyObj<MatDialog>

  beforeEach(() => {
    authService = createSpyObj(["login"])
    userPublisher = createSpyObj(["getUser"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        MatSidenavModule,
        BrowserAnimationsModule,
        MatIconModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations: [SidebarComponent],
      providers: [
        {provide: AuthService, useValue: authService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    userPublisher.getUser.and.returnValue(of(null))
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
