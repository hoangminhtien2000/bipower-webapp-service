import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {UserStorage} from "../storage/user.storage";
import {TeamValidator} from "../../all-modules/team/team.validator";

export const requiredRolesField = 'REQUIRED_ROLE';

@Injectable({
    providedIn: 'root'
})
export class PassRoleGuard implements CanActivate, CanActivateChild {

    constructor(private userStorage: UserStorage,
                private teamValidator: TeamValidator) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkRole(route);
    }

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkRole(childRoute);
    }

    checkRole(route: ActivatedRouteSnapshot): boolean {
        const requiredRole = route.data[requiredRolesField] as any[];
        if (!requiredRole || requiredRole.length == 0)
            return true;
        return this.teamValidator.validatePermission(requiredRole);
    }

}
