import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {UserPublisher} from "../../service/user-publisher";
import {UserService} from "../../service/user.service";
import {User} from "../../model";
import {Subscription, switchMap} from "rxjs";
import {
  ImageCropperDialogComponent
} from "../../../../shared/component/image-cropper-dialog/image-cropper-dialog.component";
import {PasswordChangeDialogComponent} from "../password-change-dialog/password-change-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-profile-account',
  templateUrl: './profile-account.component.html',
  styleUrls: ['./profile-account.component.scss']
})
export class ProfileAccountComponent implements OnInit, OnDestroy {

  user: User | null = null

  userImageOriginalFile: File | null = null

  userImageCroppedFile: File | null = null

  userFormGroup = new FormGroup({
    name: new FormControl("", Validators.max(50)),
    familyName: new FormControl("", Validators.max(50))
  })

  subs: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private userService: UserService,
              private userPublisher: UserPublisher,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.loadUser()
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadUser() {
    if (this.route.parent) {
      this.subs.push(this.route.parent.paramMap
        .subscribe(map => {
          this.subs.push(this.userService.getById(map.get("userId")!)
            .subscribe(user => {
              this.user = user
              this.userFormGroup.setValue({
                name: this.user!.name,
                familyName: this.user!.familyName
              })
            }))
        }))
    }
  }

  editUser() {
    this.userFormGroup.controls.name.markAsTouched()
    this.userFormGroup.controls.familyName.markAsTouched()
    this.subs.push(this.userService.edit(this.user!.id, {
      name: this.userFormGroup.value.name!,
      familyName: this.userFormGroup.value.familyName!
    }).pipe(switchMap(() => this.userService.getById(this.user!.id)))
      .subscribe(user => {
        this.user = user
        this.userPublisher.publish(user)
      }))
  }

  inputOriginalUserImage(event: any) {
    this.userImageOriginalFile = event.target.files[0]
    if (this.userImageOriginalFile) {
      this.openImageCropperDialog()
    }
  }

  openImageCropperDialog() {
    const dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      maxWidth: 850,
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: {
        originalImage: this.userImageOriginalFile,
      },
    })
    this.subs.push(dialogRef.afterClosed().subscribe((croppedImage: File) => {
      this.userImageCroppedFile = croppedImage
      this.changeUserImage()
    }))
  }

  changeUserImage() {
    if (this.userImageCroppedFile) {
      this.subs.push(this.userService.changePicture(this.user!.id, this.userImageCroppedFile)
        .pipe(switchMap(() => this.userService.getById(this.user!.id)))
        .subscribe(user => {
          this.user = user
          this.userPublisher.publish(user)
        }))
    }
  }

  openPasswordChangeDialog() {
    this.dialog.open(PasswordChangeDialogComponent, {
      enterAnimationDuration: "100ms",
      exitAnimationDuration: "100ms",
      data: {
        userId: this.user!.id
      }
    })
  }
}
