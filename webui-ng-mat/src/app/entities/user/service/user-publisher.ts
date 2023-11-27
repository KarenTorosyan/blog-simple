import {Injectable} from "@angular/core";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "../model";

@Injectable({
  providedIn: "root"
})
export class UserPublisher {

  private userSubject = new BehaviorSubject<User | null>(null)

  publish(user: User | null) {
    this.userSubject.next(user)
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }
}
