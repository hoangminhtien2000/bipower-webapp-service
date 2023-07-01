import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import {TeamInfoComponent} from "../containers/team-info/team-info.component";

@Injectable({
  providedIn: 'root'
})
export class ExitOnchangeGuard implements CanDeactivate<TeamInfoComponent> {

  canDeactivate(
    component: TeamInfoComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canExit) {
      return true;
    }
    return component.confirmExit();
  }
  
}
