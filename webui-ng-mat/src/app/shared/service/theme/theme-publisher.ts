import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {ThemeStorage} from "./theme-storage";

export interface Theme {
  palette: string,
  isDark: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ThemePublisher {

  pinkIndigoPalette = "pink-indigo"
  orangeIndigoPalette = "orange-indigo"
  greenIndigoPalette = "green-indigo"
  blueIndigoPalette = "blue-indigo"

  darkMode = "dark"

  currentPalette: string | null = null

  private theme = new BehaviorSubject({
    palette: this.pinkIndigoPalette,
    isDark: false
  })

  constructor(private themeStorage: ThemeStorage) {
  }

  publish(theme: Theme) {
    this.currentPalette = this.getPalette()
    this.theme.next(theme)
    this.themeStorage.setTheme(theme)
    this.setSelectorToBody()
  }

  setSelectorToBody() {
    this.resolvePalette()
    this.resolveMode()
  }

  resolvePalette() {
    if (this.getPalette()) {
      if (this.currentPalette) {
        document.body.classList.remove(this.currentPalette)
      }
      document.body.classList.add(this.getPalette())
    }
  }

  resolveMode() {
    if (this.isDarkMode()) {
      document.body.classList.add(this.darkMode)
    } else {
      document.body.classList.remove(this.darkMode)
    }
  }

  getTheme() {
    return this.themeStorage.getTheme() || this.theme.getValue()
  }

  getPalette() {
    return this.getTheme().palette!
  }

  isDarkMode() {
    return this.getTheme().isDark
  }

  setDarkMode() {
    this.publish({
      palette: this.getPalette(),
      isDark: true
    })
  }

  setLightMode() {
    this.publish({
      palette: this.getPalette(),
      isDark: false
    })
  }

  toggleThemeMode() {
    return this.isDarkMode() ?
      this.setLightMode() : this.setDarkMode()
  }
}
