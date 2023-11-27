import {Injectable} from '@angular/core';
import {catchError, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {ChangePasswordRequest, User, UserEditRequest} from "../model";
import {SsoServerHttpClientErrorHandler} from "./sso-server-http-client-error-handler";
import {from, Page, Pageable, Sortable} from "./sso-server-utils";
import {AppConfigService} from "../../../shared/service/app-config/app-config.service";

@Injectable()
export class UserService {

  private apiSso = this.appConfigService.getConfig().oAuth2.issuer

  constructor(private http: HttpClient,
              private httpErrorHandler: SsoServerHttpClientErrorHandler,
              private appConfigService: AppConfigService) {
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiSso}/users/${id}`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getByEmail(email: string): Observable<User> {
    return this.http.get<User>(`${this.apiSso}/users/email/${email}`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getAllByEmail(email: Set<string>, page?: Pageable, sort?: Sortable): Observable<Page<User>> {
    let params = from(page, sort)
    params = params.append("email", [...email].join(","))
    return this.http.get<Page<User>>(`${this.apiSso}/users`, {params: params})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getAllById(id: Set<string>, page?: Pageable, sort?: Sortable): Observable<Page<User>> {
    let params = from(page, sort)
    params = params.append("id", [...id].join(","))
    return this.http.get<Page<User>>(`${this.apiSso}/users`, {params: params})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  edit(id: string, user: UserEditRequest): Observable<void> {
    return this.http.put<void>(`${this.apiSso}/users/${id}`, user, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  changePicture(id: string, file: File): Observable<void> {
    const formData = new FormData()
    formData.set("picture", file)
    return this.http.post<void>(`${this.apiSso}/users/${id}/picture`, formData, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  changePassword(id: string, password: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${this.apiSso}/users/${id}/password`, password, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }
}
