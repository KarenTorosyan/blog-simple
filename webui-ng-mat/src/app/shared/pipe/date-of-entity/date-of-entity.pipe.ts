import {Pipe, PipeTransform} from '@angular/core';
import {DatePipe} from "@angular/common";

@Pipe({
  name: 'dateOfEntity',
  standalone: true
})
export class DateOfEntityPipe implements PipeTransform {

  transform(createdDate: Date, updatedDate: Date | null): unknown {
    return updatedDate ?
      `Updated at ${this.format(updatedDate)}` : this.format(createdDate)
  }

  format(date: Date): string {
    return new DatePipe("en-US")
      .transform(date, "dd MMM yyyy HH:mm:ss")!
  }
}
