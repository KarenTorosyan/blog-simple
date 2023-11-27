import {Component} from '@angular/core';
import {OAuthService} from "angular-oauth2-oidc";

@Component({
  selector: 'app-token-info',
  templateUrl: './token-info.component.html',
  styleUrls: ['./token-info.component.scss']
})
export class TokenInfoComponent {

  constructor(private oAuthService: OAuthService) {
  }

  get idToken() {
    return this.oAuthService.getIdToken()
  }

  get accessToken() {
    return this.oAuthService.getAccessToken()
  }

  get claims() {
    return this.oAuthService.getIdentityClaims()
  }
}
