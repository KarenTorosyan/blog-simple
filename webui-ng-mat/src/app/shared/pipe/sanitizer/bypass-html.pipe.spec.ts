import { BypassHtmlPipe } from './bypass-html.pipe';
import SpyObj = jasmine.SpyObj;
import {DomSanitizer} from "@angular/platform-browser";
import createSpyObj = jasmine.createSpyObj;
import {TestBed} from "@angular/core/testing";

describe('BypassHtmlPipe', () => {
  let sanitizer: SpyObj<DomSanitizer>

  beforeAll(() => {
    sanitizer = createSpyObj(["bypassSecurityTrustHtml"])
    TestBed.configureTestingModule({
      providers: [
        {provide: DomSanitizer, useValue: sanitizer}
      ]
    })
  })

  it('create an instance', () => {
    const pipe = new BypassHtmlPipe(sanitizer);
    expect(pipe).toBeTruthy();
  });
});
