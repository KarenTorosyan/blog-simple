import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ProfileSettingsComponent} from './profile-settings.component';
import {MatCardModule} from "@angular/material/card";
import {MatRadioModule} from "@angular/material/radio";
import {RouterTestingHarness, RouterTestingModule} from "@angular/router/testing";
import {ThemePublisher} from "../../../../shared/service/theme/theme-publisher";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;
import {ReactiveFormsModule} from "@angular/forms";

describe('ProfileSettingsComponent', () => {
  let component: ProfileSettingsComponent;
  let fixture: ComponentFixture<ProfileSettingsComponent>;
  let routerHarness: RouterTestingHarness
  let themePublisher: SpyObj<ThemePublisher>

  beforeEach(async () => {
    themePublisher = createSpyObj([
      "getPalette",
      "publish",
      "pinkBlueGrayPalette",
      "orangeBlueGrayPalette",
      "greenBlueGrayPalette",
      "blueBlueGrayPalette",
      "isDarkMode",
      "toggleThemeMode"
    ])
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{
          path: "profile/:id",
          children: [{path: "settings", component: ProfileSettingsComponent}]
        }]),
        MatCardModule,
        MatRadioModule,
        MatSlideToggleModule,
        ReactiveFormsModule
      ],
      declarations: [ProfileSettingsComponent],
      providers: [
        {provide: ThemePublisher, useValue: themePublisher}
      ]
    });
    fixture = TestBed.createComponent(ProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    routerHarness = await RouterTestingHarness.create()
    await routerHarness.navigateByUrl("/profile/1/settings")
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
