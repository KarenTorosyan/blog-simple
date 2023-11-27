import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Post} from "../../model";
import {PostService} from "../../service/post.service";
import {FormControl} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {Page, Pageable, Searchable, Sortable} from "../../../../shared/service/utils";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {Observable, Subscription, tap} from "rxjs";
import {User} from "../../../user/model";
import {UserService} from "../../../user/service/user.service";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  @Input() withAuthors = true
  @Input() byAuthor: string | undefined = undefined
  @Input() withDate = true
  @Input() withSearching = true
  @Input() withSorting = true
  @Input() withSortingDirections = true
  @Input() pageNumQueryParam = "page"
  @Input() sortQueryParam = "sort"
  @Input() searchQueryParam = "term"
  @Output() postsLength = new EventEmitter<number>()

  searchControl = new FormControl("")
  defaultSortCandidate = "createdDate,desc"
  sortControl = new FormControl(this.defaultSortCandidate)
  sortCandidates = [
    {title: "Newest first", expression: "createdDate,desc"},
    {title: "Oldest first", expression: "createdDate,asc"}
  ]

  postsPage: Page<Post> | null = null
  page: Pageable = {page: 0, size: 5}
  search: Searchable | undefined
  sort: Sortable | undefined = undefined

  postAuthors: Map<string, User> = new Map<string, User>()

  subs: Subscription[] = []

  constructor(private postService: PostService,
              private userService: UserService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.subs.push(this.loadQueryParameters()
      .subscribe(() => this.loadPostsPage()))
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe())
    this.subs = []
  }

  loadQueryParameters(): Observable<ParamMap> {
    return this.route.queryParamMap
      .pipe(tap(params => {
        this.loadPageQueryParams(params)
        this.loadSearchQueryParams(params)
        this.loadSortQueryParams(params)
      }))
  }

  loadPageQueryParams(params: ParamMap) {
    const pageNumber = params.get(this.pageNumQueryParam)
    if (pageNumber && !isNaN(+pageNumber)) {
      this.page.page = +pageNumber
    }
  }

  loadSearchQueryParams(params: ParamMap) {
    const searchTerm = params.get(this.searchQueryParam)
    if (searchTerm) {
      this.search = {term: searchTerm}
      this.searchControl.setValue(searchTerm)
    }
  }

  loadSortQueryParams(params: ParamMap) {
    const sort = params.get(this.sortQueryParam)
    if (sort) {
      this.sort = {expression: sort}
      this.sortControl.setValue(sort)
    }
  }

  loadPostsPage() {
    this.subs.push(this.postService.getPosts(
      this.page, this.sort, this.search, this.byAuthor)
      .subscribe(postsPage => {
        this.postsPage = postsPage
        this.postsLength.emit(postsPage.content.length)
        this.loadPostAuthors(postsPage)
      }))
  }

  loadPostAuthors(postsPage: Page<Post>) {
    this.postAuthors = new Map<string, User>();
    const emails = postsPage.content.map(post => post.author)
    if (emails.length < 1) return
    this.subs.push(this.userService.getAllByEmail(new Set(emails))
      .subscribe(usersPage => usersPage.content.forEach(user =>
        this.postAuthors.set(user.email.address, user))))
  }

  handlePageEvent(event: PageEvent) {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.pageNumQueryParam] = event.pageIndex
    this.page.size = event.pageSize
    this.router.navigate([], {queryParams: queryParams})
      .then(() => this.loadPostsPage())
  }

  onChangeSortCandidate() {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.sortQueryParam] = this.sortControl.value
    this.router.navigate([], {queryParams: queryParams})
      .then(() => this.loadPostsPage())
  }

  onChangeSearchTerm() {
    const queryParams = {...this.route.snapshot.queryParams}
    queryParams[this.searchQueryParam] = this.searchControl.value
    if (this.searchControl.value === "") {
      queryParams[this.searchQueryParam] = null
      this.search = {term: ""}
    }
    queryParams[this.sortQueryParam] = null
    queryParams[this.pageNumQueryParam] = null
    this.page.page = 0
    this.router.navigate([], {queryParams: queryParams})
      .then(() => this.loadPostsPage())
  }

  clearSearchControl() {
    this.searchControl.setValue("")
    this.search = {term: ""}
    this.sortControl.setValue(this.defaultSortCandidate)
    this.loadPostsPage()
  }
}
