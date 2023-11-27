import {Component, Input} from '@angular/core';
import {Post} from "../../model";
import {User} from "../../../user/model";
import Editor from "../../../../../../ckeditor-custom-build/build/ckeditor";
import {DateOfEntityPipe} from "../../../../shared/pipe/date-of-entity/date-of-entity.pipe";

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.scss']
})
export class PostItemComponent {

  @Input() post: Post | null = null
  @Input() postAuthors = new Map<string, User>()
  @Input() withAuthors = true

  editor = Editor

  getAuthorByEmail(email: string) {
    return this.postAuthors.get(email)!
  }

  getPostDate(post: Post) {
    return new DateOfEntityPipe()
      .transform(post.createdDate, post.updatedDate)
  }
}
