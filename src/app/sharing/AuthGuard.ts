import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {UserStorage} from '../core/storage/user.storage';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private userStorage: UserStorage
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isLoginPage = state.url.startsWith("/login");
        if (this.userStorage.checkExistsIsLogin()) {
            if (isLoginPage) {
                this.router.navigate(['/layout/timemanagement/presencemanagement']);
            }
            return true;
        }

        if (!isLoginPage) {
            this.router.navigate(['/login']);
        }
        return true;
    }
}
