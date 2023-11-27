import {TestBed} from "@angular/core/testing";
import {PostService} from "./post.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClientErrorHandler} from "../../../shared/service/http-client-error-handler";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe("PostService", () => {
  let postService: PostService
  let httpController: HttpTestingController
  let httpErrorHandler: SpyObj<HttpClientErrorHandler>

  beforeAll(() => {
    httpErrorHandler = createSpyObj(["handle"])
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        PostService,
        {provide: HttpClientErrorHandler, useValue: httpErrorHandler}
      ]
    })
    postService = TestBed.inject(PostService)
    httpController = TestBed.inject(HttpTestingController)
  })

  it('should be created', () => {
    expect(postService).toBeTruthy()
  });
})
