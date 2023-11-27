import {TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {AppComponent} from './app.component';
import {ThemePublisher} from "./shared/service/theme/theme-publisher";
import {Component, EventEmitter, Output} from "@angular/core";
import SpyObj = jasmine.SpyObj;
import createSpyObj = jasmine.createSpyObj;

@Component({
  selector: "app-header",
  template: ``
})
class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter()
}

@Component({
  selector: "app-sidebar",
  template: ``
})
class SidebarComponent {
}

@Component({
  selector: "app-footer",
  template: ``
})
class FooterComponent {
}

describe('AppComponent', () => {
  let themePublisher: SpyObj<ThemePublisher>

  beforeEach(() => {
    themePublisher = createSpyObj(["publish"])
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, HeaderComponent, SidebarComponent, FooterComponent],
      providers: [
        {provide: ThemePublisher, useValue: themePublisher}
      ]
    })
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'webui-ng-mat'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('webui-ng-mat');
  });
});
