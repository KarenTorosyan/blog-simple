import {HttpClient} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Injectable} from "@angular/core";

export interface AppConfig {
  apiBlog: string
  apiFiles: string
  oAuth2: {
    issuer: string,
    clientId: string
    responseType: string
    scopes: string
  }
}

@Injectable({
  providedIn: "root"
})
export class AppConfigService {

  private config = {
    apiBlog: "http://localhost:8200",
    apiFiles: "http://localhost:8100",
    oAuth2: {
      issuer: "http://localhost:9000",
      clientId: "public",
      responseType: "code",
      scopes: "openid profile"
    }
  } as AppConfig

  constructor(private http: HttpClient) {
  }

  loadConfig(): Observable<any> {
    return this.http.get("/assets/app-config.json")
      .pipe(tap(config => this.config = config as AppConfig));
  }

  getConfig(): AppConfig {
    return this.config
  }
}
