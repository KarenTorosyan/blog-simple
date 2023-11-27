import {TestBed} from "@angular/core/testing";
import {ThemeStorage} from "./theme-storage";

describe("ThemeStorage", () => {
  let themeStorage: ThemeStorage

  beforeAll(() => {
    TestBed.configureTestingModule({
      providers: [ThemeStorage]
    })
    themeStorage = TestBed.inject(ThemeStorage)
  })

  it('should be created', () => {
    expect(themeStorage).toBeTruthy()
  });
})
