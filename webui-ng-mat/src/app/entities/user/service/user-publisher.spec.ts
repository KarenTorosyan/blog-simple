import {TestBed} from "@angular/core/testing";
import {UserPublisher} from "./user-publisher";

describe("UserPublisher", () => {
  let userPublisher: UserPublisher

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [
        UserPublisher
      ]
    })
    userPublisher = TestBed.inject(UserPublisher)
  })

  it('should be created', () => {
    expect(userPublisher).toBeTruthy()
  });
})
