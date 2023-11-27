import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileAccountComponent} from './profile-account.component';
import {MatCardModule} from "@angular/material/card";
import {ReactiveFormsModule} from "@angular/forms";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {UserService} from "../../service/user.service";
import {UserPublisher} from "../../service/user-publisher";
import {MatDialog} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {User} from "../../model";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ProfileAccountComponent', () => {
  let component: ProfileAccountComponent;
  let fixture: ComponentFixture<ProfileAccountComponent>;
  let routerHarness: RouterTestingHarness
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let dialog: SpyObj<MatDialog>

  beforeEach(async () => {
    userService = createSpyObj([
      "edit",
      "getById",
      "changePicture"
    ])
    userPublisher = createSpyObj(["publish"])
    dialog = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {
            path: "profile/:userId",
            children: [{path: "account", component: ProfileAccountComponent}]
          }
        ])
      ],
      declarations: [ProfileAccountComponent],
      providers: [
        {provide: UserService, useValue: userService},
        {provide: UserPublisher, useValue: userPublisher},
        {provide: MatDialog, useValue: dialog}
      ]
    });
    fixture = TestBed.createComponent(ProfileAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/profile/1/account")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
