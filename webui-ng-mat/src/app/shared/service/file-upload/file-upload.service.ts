import {HttpClient} from "@angular/common/http";
import {catchError, Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {FileUploadServerHttpClientErrorHandler} from "./file-upload-server-http-client-error-handler";
import {AppConfigService} from "../app-config/app-config.service";

export interface FileUploadResponse {
  url: string
}

@Injectable()
export class FileUploadService {

  apiUrl = this.appConfigService.getConfig().apiFiles

  constructor(private http: HttpClient,
              private httpErrorHandler: FileUploadServerHttpClientErrorHandler,
              private appConfigService: AppConfigService) {
  }

  upload(file: File): Observable<FileUploadResponse> {
    const formData = new FormData()
    formData.set("file", file, file.name)
    return this.http.post<FileUploadResponse>(`${this.apiUrl}/upload`, formData)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }
}
