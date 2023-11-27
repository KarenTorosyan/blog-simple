import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './layouts/header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSidenavModule} from "@angular/material/sidenav";
import {SidebarComponent} from './layouts/sidebar/sidebar.component';
import {AuthConfigModule} from './auth/auth.config.module';
import {NameOfUserPipe} from "./entities/user/pipe/name-of-user.pipe";
import {PictureOfUserPipe} from "./entities/user/pipe/picture-of-user.pipe";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ResourceNotFoundComponent} from './shared/component/resource-not-found/resource-not-found.component';
import {MatCardModule} from "@angular/material/card";
import {PostListComponent} from './entities/post/component/post-list/post-list.component';
import {PostItemComponent} from './entities/post/component/post-item/post-item.component';
import {BypassHtmlPipe} from "./shared/pipe/sanitizer/bypass-html.pipe";
import {NgOptimizedImage} from "@angular/common";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatPaginatorModule} from "@angular/material/paginator";
import {FooterComponent} from './layouts/footer/footer.component';
import {ProfileComponent} from './entities/user/component/profile/profile.component';
import {MatTabsModule} from "@angular/material/tabs";
import {ImageCropperDialogComponent} from './shared/component/image-cropper-dialog/image-cropper-dialog.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {PostDetailsComponent} from './entities/post/component/post-details/post-details.component';
import {PostDeleteDialogComponent} from './entities/post/component/post-delete-dialog/post-delete-dialog.component';
import {MatRadioModule} from "@angular/material/radio";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {PostCreateComponent} from './entities/post/component/post-create/post-create.component';
import {UserService} from "./entities/user/service/user.service";
import {PostService} from "./entities/post/service/post.service";
import {FileUploadService} from "./shared/service/file-upload/file-upload.service";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {MatStepperModule} from "@angular/material/stepper";
import {
  PasswordChangeDialogComponent
} from './entities/user/component/password-change-dialog/password-change-dialog.component';
import {PostEditComponent} from './entities/post/component/post-edit/post-edit.component';
import {PostCommentWriteComponent} from './entities/post/component/post-comment-write/post-comment-write.component';
import {PostCommentListComponent} from './entities/post/component/post-comment-list/post-comment-list.component';
import {PostCommentItemComponent} from './entities/post/component/post-comment-item/post-comment-item.component';
import {
  PostCommentDeleteDialogComponent
} from './entities/post/component/post-comment-delete-dialog/post-comment-delete-dialog.component';
import {CountOfPostsPipe} from './entities/post/pipe/count-of-posts/count-of-posts.pipe';
import {LocaleAcceptHeaderInterceptor} from "./shared/interceptor/locale-accept-header-interceptor";
import {CsrfInterceptor} from "./shared/interceptor/csrf.interceptor";
import {ProfilePostsComponent} from './entities/user/component/profile-posts/profile-posts.component';
import {
  ProfilePostCommentsComponent
} from './entities/user/component/profile-post-comments/profile-post-comments.component';
import {ProfileAccountComponent} from './entities/user/component/profile-account/profile-account.component';
import {ProfileSettingsComponent} from './entities/user/component/profile-settings/profile-settings.component';
import {AuthInterceptor} from "./auth/auth.interceptor";
import {SharedModule} from "./shared/shared.module";
import {AppConfigService} from "./shared/service/app-config/app-config.service";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
    NameOfUserPipe,
    PictureOfUserPipe,
    BypassHtmlPipe,
    ResourceNotFoundComponent,
    PostListComponent,
    PostItemComponent,
    ProfileComponent,
    ProfilePostsComponent,
    ProfilePostCommentsComponent,
    ProfileAccountComponent,
    ProfileSettingsComponent,
    CountOfPostsPipe,
    ImageCropperDialogComponent,
    PostDetailsComponent,
    PostDeleteDialogComponent,
    PostCreateComponent,
    PasswordChangeDialogComponent,
    PostEditComponent,
    PostCommentWriteComponent,
    PostCommentListComponent,
    PostCommentItemComponent,
    PostCommentDeleteDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    AuthConfigModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatCardModule,
    NgOptimizedImage,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTabsModule,
    ImageCropperModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    MatSlideToggleModule,
    CKEditorModule,
    MatStepperModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (appConfigService: AppConfigService) => () => {
        return appConfigService.loadConfig()
      },
      deps: [AppConfigService],
      multi: true
    },
    {provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LocaleAcceptHeaderInterceptor, multi: true},
    {provide: UserService, useClass: UserService},
    {provide: PostService, useClass: PostService},
    {provide: FileUploadService, useClass: FileUploadService},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
