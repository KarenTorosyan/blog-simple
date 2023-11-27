import {Injectable} from '@angular/core';
import {
  Post,
  PostComment,
  PostCommentAddRequest,
  PostCommentEditRequest,
  PostCommentReaction,
  PostCommentReactionDetails,
  PostCommentReactionSetRequest,
  PostCreateRequest,
  PostEditRequest,
  PostReaction,
  PostReactionDetails,
  PostReactionSetRequest
} from "../model";
import {catchError, Observable} from "rxjs";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {from, Page, Pageable, Searchable, Sortable} from "../../../shared/service/utils";
import {HttpClientErrorHandler} from "../../../shared/service/http-client-error-handler";
import {AppConfigService} from "../../../shared/service/app-config/app-config.service";

@Injectable()
export class PostService {

  apiBlog = this.appConfigService.getConfig().apiBlog

  constructor(private http: HttpClient,
              private httpErrorHandler: HttpClientErrorHandler,
              private appConfigService: AppConfigService) {
  }

  createPost(post: PostCreateRequest): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.apiBlog}/posts`, post, {withCredentials: true, observe: "response"})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  editPost(id: string, post: PostEditRequest): Observable<void> {
    return this.http.put<void>(`${this.apiBlog}/posts/${id}`, post, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBlog}/posts/${id}`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getPosts(page?: Pageable, sort?: Sortable, search?: Searchable, author?: string): Observable<Page<Post>> {
    let params = from(page, sort, search)
    if (author) params = params.set("author", author)
    return this.http.get<Page<Post>>(`${this.apiBlog}/posts`, {params: params})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiBlog}/posts/${id}`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  addComment(id: string, comment: PostCommentAddRequest): Observable<HttpResponse<void>> {
    return this.http.post<void>(`${this.apiBlog}/posts/${id}/comments`, comment, {
      withCredentials: true,
      observe: "response"
    })
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  editComment(commentId: string, comment: PostCommentEditRequest): Observable<void> {
    return this.http.put<void>(`${this.apiBlog}/posts/comments/${commentId}`, comment, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  deleteComment(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBlog}/posts/comments/${commentId}`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getComments(id: string, page?: Pageable, sort?: Sortable): Observable<Page<PostComment>> {
    return this.http.get<Page<PostComment>>(`${this.apiBlog}/posts/${id}/comments`, {params: from(page, sort)})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getCommentChildren(commentId: string): Observable<PostComment[]> {
    return this.http.get<PostComment[]>(`${this.apiBlog}/posts/comments/children/${commentId}`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getCommentsBySubject(subject: string, page?: Pageable, sort?: Sortable): Observable<Page<PostComment>> {
    return this.http.get<Page<PostComment>>(`${this.apiBlog}/posts/comments/${subject}`, {params: from(page, sort)})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getComment(id: string, commentId: string): Observable<PostComment> {
    return this.http.get<PostComment>(`${this.apiBlog}/posts/${id}/comments/${commentId}`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  setReaction(id: string, reaction: PostReactionSetRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBlog}/posts/${id}/reactions`, reaction, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getReactionOfCurrentSubject(id: string): Observable<PostReaction> {
    return this.http.get<PostReaction>(`${this.apiBlog}/posts/${id}/reactions`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getReactionDetails(id: string): Observable<PostReactionDetails[]> {
    return this.http.get<PostReactionDetails[]>(`${this.apiBlog}/posts/${id}/reactions/details`)
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  deleteReaction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBlog}/posts/${id}/reactions`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  setCommentReaction(commentId: string, reaction: PostCommentReactionSetRequest): Observable<void> {
    return this.http.post<void>(`${this.apiBlog}/posts/comments/${commentId}/reactions`, reaction, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getCommentReactionOfCurrentSubject(commentId: string): Observable<PostCommentReaction> {
    return this.http.get<PostCommentReaction>(`${this.apiBlog}/posts/comments/${commentId}/reactions`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getCommentReactionsOfSubject(commentId: Set<string>): Observable<PostCommentReaction[]> {
    let params = new HttpParams()
    params = params.append("commentId", [...commentId].join(","))
    return this.http.get<PostCommentReaction[]>(`${this.apiBlog}/posts/comments/reactions`, {params: params})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  getCommentReactionDetails(commentId: Set<string>): Observable<PostCommentReactionDetails[]> {
    let params = new HttpParams()
    params = params.append("commentId", [...commentId].join(","))
    return this.http.get<PostCommentReactionDetails[]>(`${this.apiBlog}/posts/comments/reactions/details`, {params: params})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }

  deleteCommentReaction(commentId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiBlog}/posts/comments/${commentId}/reactions`, {withCredentials: true})
      .pipe(catchError(err => this.httpErrorHandler.handle(err)))
  }
}
