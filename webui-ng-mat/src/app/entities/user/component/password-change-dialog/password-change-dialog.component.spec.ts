import {ComponentFixture, TestBed} from '@angular/core/testing';

import {PasswordChangeDialogComponent} from './password-change-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {UserService} from "../../service/user.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatIconModule} from "@angular/material/icon";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

describe('PasswordChangeDialogComponent', () => {
  let component: PasswordChangeDialogComponent;
  let fixture: ComponentFixture<PasswordChangeDialogComponent>;
  const dialogData = {userId: 1}
  let userService: SpyObj<UserService>
  let snackbar: SpyObj<MatSnackBar>

  beforeEach(() => {
    userService = createSpyObj(["changePassword"])
    snackbar = createSpyObj(["open"])
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      declarations: [PasswordChangeDialogComponent],
      providers: [
        {provide: MAT_DIALOG_DATA, useValue: dialogData},
        {provide: UserService, useValue: userService},
        {provide: MatSnackBar, useValue: snackbar}
      ]
    });
    fixture = TestBed.createComponent(PasswordChangeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
