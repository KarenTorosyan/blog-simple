import {NgModule} from '@angular/core';
import {OAuthModule, OAuthStorage} from "angular-oauth2-oidc";
import {TokenInfoComponent} from './token-info/token-info.component';
import {MatCardModule} from "@angular/material/card";
import {JsonPipe} from "@angular/common";
import {LogoutDialogComponent} from './logout-dialog/logout-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {TokenExpiredDialogComponent} from './token-expired-dialog/token-expired-dialog.component';
import {RouterLink} from "@angular/router";
import {
  AuthorizationRequiredDialogComponent
} from './authorization-required-dialog/authorization-required-dialog.component';
import {ForbiddenDialogComponent} from './forbidden-dialog/forbidden-dialog.component';
import {SharedModule} from "../shared/shared.module";

@NgModule({
  imports: [
    OAuthModule.forRoot(),
    SharedModule,
    MatCardModule,
    JsonPipe,
    MatDialogModule,
    MatButtonModule,
    RouterLink
  ],
  exports: [
    OAuthModule
  ],
  providers: [
    {provide: OAuthStorage, useValue: localStorage}
  ],
  declarations: [
    TokenInfoComponent,
    LogoutDialogComponent,
    TokenExpiredDialogComponent,
    AuthorizationRequiredDialogComponent,
    ForbiddenDialogComponent
  ]
})
export class AuthConfigModule {
}
