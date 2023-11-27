import {Component, OnInit} from '@angular/core';
import {ThemePublisher} from "./shared/service/theme/theme-publisher";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'webui-ng-mat';

  constructor(private themePublisher: ThemePublisher) {
  }

  ngOnInit() {
    this.themePublisher.setSelectorToBody()
  }
}
