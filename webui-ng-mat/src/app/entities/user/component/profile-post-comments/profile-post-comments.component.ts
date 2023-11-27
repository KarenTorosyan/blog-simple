import {Component, OnDestroy, OnInit} from '@angular/core';
import {Page} from "../../service/sso-server-utils";
import {PostComment, PostCommentReactionDetails} from "../../../post/model";
import {Pageable, Sortable} from "../../../../shared/service/utils";
import {User} from "../../model";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PostService} from "../../../post/service/post.service";
import {PageEvent} from "@angular/material/paginator";
import {FormControl} from "@angular/forms";
import {Observable, Subscription, tap} from "rxjs";
import {UserPublisher} from "../../service/user-publisher";
import {UserService} from "../../service/user.service";

@Component({
  selector: 'app-profile-post-comments',
  templateUrl: './profile-post-comments.component.html',
  styleUrls: ['./profile-post-comments.component.scss']
})
export class ProfilePostCommentsComponent implements OnInit, OnDestroy {

  user!: User
  currentUser: User | null = null

  postComments: Page<PostComment> | null = null
  page: Pageable = {page: 0, size: 10}
  sort: Sortable | undefined = undefined

  sortControl = new FormControl("createdDate,desc")
  sortCandidates = [
    {title: "Sequence", expression: "createdDate,asc"},
    {title: "Newest first", expression: "createdDate,desc"}
  ]

  pageQueryParam = "page"
  sortQueryParam = "sort"

  reactionDetails = new Map<string, PostCommentReactionDetails[]>

  subs: Subscription[] = []

  constructor(private route: ActivatedRoute,
              private router: Router,
              private userService: UserService,
              private userPublisher: UserPublisher,
              private postService: PostService) {
  }

  ngOnInit() {
    this.subs.push(this.loadQueryParameters()
      .subscribe(() => {
        this.loadUser()
        this.loadCurrentUser()
      }))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadQueryParameters(): Observable<ParamMap> {
    return this.route.queryParamMap
      .pipe(tap(map => {
        this.loadPageNumberQueryParam(map)
        this.loadSortQueryParam(map)
      }))
  }

  loadPageNumberQueryParam(map: ParamMap) {
    if (map.has(this.pageQueryParam)) {
      const pageNumber = map.get(this.pageQueryParam)!
      if (!isNaN(+pageNumber)) {
        this.page.page = +pageNumber
      }
    }
  }

  loadSortQueryParam(map: ParamMap) {
    if (map.has(this.sortQueryParam)) {
      this.sort = {expression: map.get(this.sortQueryParam)!}
    }
  }

  loadUser() {
    if (this.route.parent) {
      this.subs.push(this.route.parent.paramMap
        .subscribe(map => {
          this.subs.push(this.userService.getById(map.get("userId")!)
            .subscribe(user => {
              this.user = user
              this.loadPostComments()
            }))
        }))
    }
  }

  loadCurrentUser() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => this.currentUser = user))
  }

  loadPostComments() {
    this.subs.push(this.postService.getCommentsBySubject(
      this.user.email.address, this.page, this.sort)
      .subscribe(postCommentsPage => {
        this.postComments = postCommentsPage
        this.loadReactionDetails(postCommentsPage)
      }))
  }

  onChangeSortCandidate() {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.sortQueryParam] = this.sortControl.value
    this.router.navigate([], {queryParams: queryParams})
      .then(() => this.loadPostComments())
  }

  handlePageEvent(event: PageEvent) {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.pageQueryParam] = event.pageIndex
    this.router.navigate([], {queryParams: queryParams})
      .then(() => this.loadPostComments())
    this.page.size = event.pageSize
  }

  loadReactionDetails(postComments: Page<PostComment>) {
    const commentIds = postComments.content.map(comment => comment.id)
    if (commentIds.length < 1) return
    this.subs.push(this.postService.getCommentReactionDetails(new Set(commentIds))
      .subscribe(allReactionDetails => {
        allReactionDetails.forEach(details => {
          if (!this.reactionDetails.has(details.postCommentId)) {
            this.reactionDetails.set(details.postCommentId, [])
          }
          this.reactionDetails.get(details.postCommentId)!.push(details)
        })
      }))
  }
}
