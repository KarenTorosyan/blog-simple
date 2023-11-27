import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ResourceNotFoundComponent} from "./shared/component/resource-not-found/resource-not-found.component";
import {PostListComponent} from "./entities/post/component/post-list/post-list.component";
import {TokenInfoComponent} from "./auth/token-info/token-info.component";
import {PostDetailsComponent} from "./entities/post/component/post-details/post-details.component";
import {PostCreateComponent} from "./entities/post/component/post-create/post-create.component";
import {PostEditComponent} from "./entities/post/component/post-edit/post-edit.component";
import {authGuard} from "./auth/auth.guard";
import {ProfileComponent} from "./entities/user/component/profile/profile.component";
import {ProfilePostsComponent} from "./entities/user/component/profile-posts/profile-posts.component";
import {
  ProfilePostCommentsComponent
} from "./entities/user/component/profile-post-comments/profile-post-comments.component";
import {ProfileAccountComponent} from "./entities/user/component/profile-account/profile-account.component";
import {ProfileSettingsComponent} from "./entities/user/component/profile-settings/profile-settings.component";

const activationGuards = [
  authGuard
]

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "post/list"},
  {
    path: "info", children: [
      {path: "token", component: TokenInfoComponent, canActivate: activationGuards}
    ]
  },
  {
    path: "user", children: [{
      path: "profile/:userId", component: ProfileComponent, children: [
        {path: "", pathMatch: "full", redirectTo: "posts"},
        {path: "posts", component: ProfilePostsComponent},
        {path: "comments", component: ProfilePostCommentsComponent},
        {path: "account", component: ProfileAccountComponent, canActivate: activationGuards},
        {path: "settings", component: ProfileSettingsComponent, canActivate: activationGuards}
      ]
    }]
  },
  {
    path: "post", children: [
      {path: "list", component: PostListComponent},
      {path: "create", component: PostCreateComponent, canActivate: activationGuards},
      {path: "edit/:postId", component: PostEditComponent, canActivate: activationGuards},
      {path: "details/:postId", component: PostDetailsComponent},
    ]
  },
  {path: "**", component: ResourceNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
