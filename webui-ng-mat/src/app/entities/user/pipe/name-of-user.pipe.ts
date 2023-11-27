import {Pipe, PipeTransform} from '@angular/core';
import {User} from "../model";

@Pipe({
  name: 'nameOfUser'
})
export class NameOfUserPipe implements PipeTransform {

  transform(user: User): any {
    let name = ""
    if (user.name) {
      name += user.name
      if (user.familyName) {
        name += ` ${user.familyName}`
      }
    } else if (user.familyName) {
      name = user.familyName
    } else {
      name = user.email.address
    }
    return name
  }
}
