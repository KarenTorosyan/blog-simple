import {TestBed} from '@angular/core/testing';

import {ThemePublisher} from './theme-publisher';
import {ThemeStorage} from "./theme-storage";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

describe('ThemePublisher', () => {
  let themePublisher: ThemePublisher;
  let themeStorage: SpyObj<ThemeStorage>

  beforeAll(() => {
    themeStorage = createSpyObj([
      "setTheme",
      "getTheme"
    ])
    TestBed.configureTestingModule({
      providers: [
        {provide: ThemeStorage, useValue: themeStorage}
      ]
    });
    themePublisher = TestBed.inject(ThemePublisher);
  });

  it('should be created', () => {
    expect(themePublisher).toBeTruthy();
  });
});
