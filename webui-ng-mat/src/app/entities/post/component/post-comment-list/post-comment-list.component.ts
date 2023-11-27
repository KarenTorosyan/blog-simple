import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PostService} from "../../service/post.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {PostComment, PostCommentReaction, PostCommentReactionDetails} from "../../model";
import {Page, Pageable, Sortable} from "../../../../shared/service/utils";
import {Observable, Subscription, tap} from "rxjs";
import {FormControl} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {User} from "../../../user/model";
import {UserService} from "../../../user/service/user.service";
import {UserPublisher} from "../../../user/service/user-publisher";

@Component({
  selector: 'app-post-comment-list',
  templateUrl: './post-comment-list.component.html',
  styleUrls: ['./post-comment-list.component.scss']
})
export class PostCommentListComponent implements OnInit, OnDestroy {

  @Input() postId: string | null = null

  @Input() pageNumQueryParam = "post_comment_page"
  @Input() sortQueryParam = "post_comment_sort"
  @Input() routeTo: string[] = []
  @Input() bySubject: string | null = null

  postCommentsPage: Page<PostComment> | null = null

  page: Pageable = {page: 0, size: 10}
  sort: Sortable | undefined = undefined

  sortControl = new FormControl("createdDate,asc")

  sortCandidates = [
    {title: "Newest first", expression: "createdDate,desc"},
    {title: "Sequence", expression: "createdDate,asc"}
  ]

  commentSubjects = new Map<string, User>()
  withSubject = true

  commentReactionDetails = new Map<string, PostCommentReactionDetails[]>()
  currentUser: User | null = null
  currentUserReaction = new Map<string, PostCommentReaction>

  subs: Subscription[] = []

  constructor(private postService: PostService,
              private userService: UserService,
              private userPublisher: UserPublisher,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.loadQueryParameters()
      .subscribe(() => this.loadPostComments())
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
    const pageNumber = map.get(this.pageNumQueryParam)
    if (pageNumber && !isNaN(+pageNumber)) {
      this.page.page = +pageNumber
    }
  }

  loadSortQueryParam(map: ParamMap) {
    const sort = map.get(this.sortQueryParam)
    if (sort) {
      this.sort = {expression: sort}
      this.sortControl.setValue(sort)
    }
  }

  onChangeSortCandidate() {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.sortQueryParam] = this.sortControl.value
    this.router.navigate(this.routeTo, {queryParams: queryParams})
      .then(() => this.loadPostComments())
  }

  handlePageEvent(event: PageEvent) {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.pageNumQueryParam] = event.pageIndex
    this.page.size = event.pageSize
    this.router.navigate(this.routeTo, {queryParams: queryParams})
      .then(() => this.loadPostComments())
  }

  loadPostComments() {
    if (this.bySubject) {
      this.subs.push(this.postService.getCommentsBySubject(this.bySubject, this.page, this.sort)
        .subscribe(postCommentsPage => this.postCommentsPage = postCommentsPage))
    } else {
      this.subs.push(this.postService.getComments(this.postId!, this.page, this.sort)
        .subscribe(postCommentsPage => {
          this.postCommentsPage = postCommentsPage
          this.loadCommentSubjects(postCommentsPage)
          this.loadCommentReactions(postCommentsPage)
          this.loadCurrentUser()
        }))
    }
  }

  loadCommentSubjects(postComments: Page<PostComment>) {
    const emails = postComments.content.map(comment => comment.subject)
    this.subs.push(this.userService.getAllByEmail(new Set(emails))
      .subscribe(postCommentsPage => {
        this.commentSubjects.clear()
        postCommentsPage.content.forEach(user => {
          this.commentSubjects.set(user.email.address, user)
        })
      }))
  }

  loadCommentReactions(postCommentsPage: Page<PostComment>) {
    const commentIds = postCommentsPage.content.map(comment => comment.id)
    if (commentIds.length < 1) return
    this.subs.push(this.postService.getCommentReactionDetails(new Set(commentIds))
      .subscribe(allReactionDetails => {
        this.commentReactionDetails.clear()
        allReactionDetails.forEach(details => {
          if (!this.commentReactionDetails.has(details.postCommentId)) {
            this.commentReactionDetails.set(details.postCommentId, [])
          }
          this.commentReactionDetails.get(details.postCommentId)!.push(details)
        })
      }))
  }

  loadCurrentUser() {
    this.subs.push(this.userPublisher.getUser()
      .subscribe(user => {
        this.currentUser = user
        this.loadCurrentUserReactions(this.postCommentsPage!)
      }))
  }

  loadCurrentUserReactions(postCommentsPage: Page<PostComment>) {
    const commentIds = postCommentsPage.content.map(comment => comment.id)
    if (!this.currentUser || commentIds.length < 1) return
    this.subs.push(this.postService.getCommentReactionsOfSubject(new Set(commentIds))
      .subscribe(reactions => {
        this.currentUserReaction.clear()
        reactions.forEach(reaction =>
          this.currentUserReaction.set(reaction.postCommentId, reaction))
      }))
  }
}
