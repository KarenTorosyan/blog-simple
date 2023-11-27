import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TokenInfoComponent} from './token-info.component';
import SpyObj = jasmine.SpyObj;
import {OAuthService} from "angular-oauth2-oidc";
import createSpyObj = jasmine.createSpyObj;
import {MatCardModule} from "@angular/material/card";
import {Component} from "@angular/core";

@Component({
  selector: "app-root-container",
  template: `<ng-content></ng-content>`
})
class RootContainerComponent {}

describe('TokenInfoComponent', () => {
  let component: TokenInfoComponent;
  let fixture: ComponentFixture<TokenInfoComponent>;
  let oAuthService: SpyObj<OAuthService>

  beforeEach(() => {
    oAuthService = createSpyObj([
      "getIdToken",
      "getAccessToken",
      "getIdentityClaims"
    ])
    TestBed.configureTestingModule({
      imports: [MatCardModule],
      declarations: [
        TokenInfoComponent,
        RootContainerComponent
      ],
      providers: [
        {provide: OAuthService, useValue: oAuthService}
      ]
    });
    fixture = TestBed.createComponent(TokenInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render id token', () => {
    const idToken = "idToken"
    oAuthService.getIdToken.and.returnValue(idToken)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector("#idToken").textContent)
      .toEqual(idToken)
  });

  it('should render access token', () => {
    const accessToken = "accessToken"
    oAuthService.getAccessToken.and.returnValue(accessToken)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector("#accessToken").textContent)
      .toEqual(accessToken)
  });

  it('should render identity claims', () => {
    const claims = [{sub: "subject"}]
    oAuthService.getIdentityClaims.and.returnValue(claims)
    fixture.detectChanges()
    expect(fixture.nativeElement.querySelector("#claims").textContent)
      .toEqual(JSON.stringify(claims, null, 2))
  });
});
