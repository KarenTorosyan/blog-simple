import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileComponent} from './profile.component';
import {Component} from "@angular/core";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {UserPublisher} from "../../service/user-publisher";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {of} from "rxjs";
import {UserService} from "../../service/user.service";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-root-container",
  template: `
    <ng-content></ng-content>`
})
class RootContainerComponent {
}

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: SpyObj<UserService>
  let userPublisher: SpyObj<UserPublisher>
  let routerHarness: RouterTestingHarness

  beforeEach(async () => {
    userService = createSpyObj(["getById"])
    userPublisher = createSpyObj(["getUser"])
    TestBed.configureTestingModule({
      imports: [
        MatCardModule,
        MatTabsModule,
        RouterTestingModule.withRoutes([
          {path: "profile", component: ProfileComponent}
        ])
      ],
      declarations: [
        ProfileComponent,
        RootContainerComponent
      ],
      providers: [
        {provide: UserPublisher, useValue: userPublisher},
        {provide: UserService, useValue: userService}
      ]
    });
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userPublisher.getUser.and.returnValue(of(null))
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/profile")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
