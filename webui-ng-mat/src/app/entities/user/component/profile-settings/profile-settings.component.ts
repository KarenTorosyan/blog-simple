import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {ThemePublisher} from "../../../../shared/service/theme/theme-publisher";

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss']
})
export class ProfileSettingsComponent {

  themePaletteControl = new FormControl(this.theme.getPalette())

  constructor(public theme: ThemePublisher) {
  }

  themeChanged() {
    this.theme.publish({
      palette: this.themePaletteControl.value!,
      isDark: this.theme.isDarkMode()
    })
  }
}
