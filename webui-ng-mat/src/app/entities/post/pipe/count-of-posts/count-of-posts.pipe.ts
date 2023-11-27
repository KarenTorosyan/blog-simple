import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'countOfPosts'
})
export class CountOfPostsPipe implements PipeTransform {

  transform(count: number): string {
    switch (count) {
      case 0:
        return "No posts";
      case 1:
        return "1 post";
      default:
        return `${count} posts`;
    }
  }
}
