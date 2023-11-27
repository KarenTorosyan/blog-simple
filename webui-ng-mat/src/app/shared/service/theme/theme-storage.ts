import {Injectable} from "@angular/core";
import {Theme} from "./theme-publisher";

@Injectable({
  providedIn: "root"
})
export class ThemeStorage {

  themeCookieName = "theme"

  setTheme(theme: Theme) {
    localStorage.setItem(this.themeCookieName, JSON.stringify(theme))
  }

  getTheme(): Theme | null {
    const theme = localStorage.getItem(this.themeCookieName)
    return theme != null ? JSON.parse(theme) : null
  }
}
