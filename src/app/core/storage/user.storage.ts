import {Injectable} from '@angular/core';
import {UserModel} from '../models';
import {CONFIG} from '../config/application.config';
import {BehaviorSubject, Observable} from 'rxjs';
import {ROLES, USER} from '../common/constant';
import {ObjectsModel} from '../models/objects.model';

@Injectable({
    providedIn: 'root',
})
export class UserStorage {

    private currentUserSubject: BehaviorSubject<UserModel>;
    public currentUser: Observable<UserModel>;

    constructor() {
        this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem(USER.CURRENT)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    getCurrentUserValue(): UserModel {
        return this.currentUserSubject.value;
    }

    setCurrentUserValue(value: UserModel) {
        this.currentUserSubject.next(value);
    }


    getAccessToken(): any {
        return localStorage.getItem(CONFIG.access_token);
    }

    setAccessToken(value) {
        localStorage.setItem(CONFIG.access_token, value);
    }

    getRefreshToken(): any {
        return localStorage.getItem(CONFIG.refresh_token);
    }

    setRefreshToken(value) {
        localStorage.setItem(CONFIG.refresh_token, value);
    }

    getDeviceToken(): any {
        return localStorage.getItem(CONFIG.device_token);
    }

    setDeviceToken(value) {
        localStorage.setItem(CONFIG.device_token, value);
    }

    getAccessTokenExpiredTime(): any {
        return localStorage.getItem(CONFIG.access_token_expired_time);
    }

    setAccessTokenExpiredTime(value) {
        localStorage.setItem(CONFIG.access_token_expired_time, value);
    }

    getRefreshTokenExpiredTime(): any {
        return localStorage.getItem(CONFIG.refresh_token_expired_time);
    }

    setRefreshTokenExpiredTime(value) {
        localStorage.setItem(CONFIG.refresh_token_expired_time, value);
    }

    getUserInfo(): any {
        return JSON.parse(localStorage.getItem(USER.INFO));
    }

    getNextUrl(): string {
        return localStorage.getItem(USER.NEXT_URL);
    }

    isMyRecord = (recordEmail) => {
        return JSON.parse(localStorage.getItem(USER.INFO)).email === recordEmail;
    }

    setUserInfo(value) {
        localStorage.setItem(USER.INFO, JSON.stringify(value));
        localStorage.setItem(USER.CURRENT, JSON.stringify(value));
    }

    setUserData(value) {
        localStorage.setItem('USER_DATA', value);
    }

    setNextUrl(value: string) {
        localStorage.setItem(USER.NEXT_URL, value);
    }

    getUserData() {
        return localStorage.getItem('USER_DATA');
    }

    logoutByDeleteAll(): void {
        localStorage.removeItem(USER.CURRENT);
        localStorage.removeItem(CONFIG.access_token);
        localStorage.removeItem(CONFIG.refresh_token);
        localStorage.removeItem(USER.NEXT_URL);
    }

    checkExistsIsLogin(): boolean {
        if (!localStorage.getItem(CONFIG.access_token)) {
            return false;
        }
        return true;
    }

    setSessionUserLogin(token) {
        localStorage.setItem(CONFIG.session, JSON.stringify(token));
    }

    makeRequestOTP(type: string, email: string, password: string) {
        localStorage.setItem(USER.OTP.TYPE, type);
        localStorage.setItem(USER.OTP.EMAIL, email);
        localStorage.setItem(USER.OTP.PASSWORD, password);
    }

    getRequestOTPType(): string {
        return localStorage.getItem(USER.OTP.TYPE);
    }

    getRequestOTPEmail() {
        return localStorage.getItem(USER.OTP.EMAIL);
    }

    getRequestOTPPassword() {
        return localStorage.getItem(USER.OTP.PASSWORD);
    }

    getUserRoles() {
        return JSON.parse(localStorage.getItem(USER.ROLES));
    }

    setUserRoles(userRoles) {
        return localStorage.setItem(USER.ROLES, JSON.stringify(userRoles));
    }

    getRoleList() {
        return JSON.parse(localStorage.getItem(ROLES.LIST));
    }

    setRoleList(data) {
        return localStorage.setItem(ROLES.LIST, JSON.stringify(data));
    }

    checkExistsRoleList() {
        let roleList = localStorage.getItem(ROLES.LIST);
        if (roleList && roleList.length > 0) {
            return true;
        }
        return false;
    }

    getUserMenu(): ObjectsModel[] {
        return JSON.parse(localStorage.getItem(USER.MENU));
    }

    setUserMenu(menu): void {
        localStorage.setItem(USER.MENU, JSON.stringify(menu));
    }

    isRoleHRALead(): boolean {
        for (var role of this.getUserRoles()) {
            if (role.code == CONFIG.CANDIDATE.ROLES_HRA_LEAD) {
                return true;
            }
        }
        return false;
    }

    isRoleRecruiterLead(): boolean {
        for (var role of this.getUserRoles()) {
            if (role.code == CONFIG.CANDIDATE.ROLES_RECRUITER_LEAD) {
                return true;
            }
        }
        return false;
    }

    isRoleHR(): boolean {
        if (this.isRoleHRALead()) {
            return false;
        }
        if (this.isRoleRecruiterLead()) {
            return false;
        }
        for (var role of this.getUserRoles()) {
            if (role.code == CONFIG.CANDIDATE.ROLES_HR) {
                return true;
            }
        }
        return false;
    }

    isRoleCTV(): boolean {
        if (this.isRoleHRALead()) {
            return false;
        }
        if (this.isRoleRecruiterLead()) {
            return false;
        }
        if (this.isRoleHR()) {
            return false;
        }
        for (var role of this.getUserRoles()) {
            if (role.code == CONFIG.CANDIDATE.ROLES_CTV) {
                return true;
            }
        }
        return false;
    }

    getPermissions(): string[] {
        return JSON.parse(localStorage.getItem(USER.PERMISSION));
    }

    setPermissions(permission: any) {
        localStorage.setItem(USER.PERMISSION, JSON.stringify(permission));
    }

    existPermission(permission: string) {
        return this.getPermissions()
            .map(obj => obj.toUpperCase())
            .some(obj => obj == permission.toUpperCase())
    }
}
