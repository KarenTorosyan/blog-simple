import {NgModule} from "@angular/core";
import {RootContainerComponent} from "./component/root-container/root-container.component";

@NgModule({
  declarations: [
    RootContainerComponent
  ],
  exports: [
    RootContainerComponent
  ]
})
export class SharedModule {
}
