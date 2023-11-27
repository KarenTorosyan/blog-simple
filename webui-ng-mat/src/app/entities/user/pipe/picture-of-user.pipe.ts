import {Pipe, PipeTransform} from '@angular/core';
import {User} from "../model";

@Pipe({
  name: 'pictureOfUser'
})
export class PictureOfUserPipe implements PipeTransform {

  defaultPicture = "assets/images/account_circle.svg"

  transform(user: User): any {
    return user.picture && user.picture.url ? user.picture.url : this.defaultPicture
  }
}
