import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  sidebarOpen$ = new BehaviorSubject<boolean>(true);

  constructor() { }

  toggleSidebar(): void {
    const opening = this.sidebarOpen$.value;
    this.sidebarOpen$.next(!opening);
  }

  private messageSource = new BehaviorSubject(false);
  currentMessage = this.messageSource.asObservable();
  changeLoginLogout(isCheckin: boolean) {
    this.messageSource.next(isCheckin);
  }
}
