import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {BehaviorSubject, Observable} from 'rxjs';
import {CONFIG} from '../config/application.config';
import {VerifyService} from './verify.service';
import {UserModel} from "../models";
import {LoginModel} from "../models/login.model";
import {ToastrService} from "ngx-toastr";
import {UserStorage} from "../storage/user.storage";
import {ObjectsModel} from "../models/objects.model";
import {LANGUAGE, USER} from "../common/constant";
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(private router: Router, private http: HttpClient,
              public verifyService: VerifyService,
              public userStorage: UserStorage,
              private toastrService: ToastrService){

  }
  redirectUrl: string;
  private url = CONFIG.API.LOGIN;
  public isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  login(username: string, password: string, type: string, otp: string, model?: any): Observable<any> {
    return this.loginAction(username, password, type, otp, model, this.url);
  }

  loginAction(username: string, password: string, type: string, otp: string, model?: any, url?: string): Observable<any> {
    let loginModel;
    if (model) {
      loginModel = model;
    } else {
      loginModel = this.getLoginModel(username, password, type, otp);
      loginModel.device_token = this.userStorage.getDeviceToken();
    }
    const formData: FormData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    return this.http.post<any>(url, formData, { }).pipe(map(token => {
      token = {
        data: token
      }
      this.userStorage.setSessionUserLogin(token);
      const mUser: UserModel = new UserModel();
      if (token && token.data.access_token) {
        mUser.token = token.data.access_token;
        this.userStorage.setAccessToken(token.data.access_token);
        this.userStorage.setRefreshToken(token.data.refresh_token);
        this.userStorage.setAccessTokenExpiredTime(token.data.expires_in);
        this.userStorage.setRefreshTokenExpiredTime(token.data.refresh_token);
        this.userStorage.setUserInfo(token.data.user_info);
        this.userStorage.setUserRoles(token.data.role_list);
        this.userStorage.setPermissions(token.data.component_list);
        this.updateMenuByLogin(token);
        this.userStorage.setCurrentUserValue(mUser);
        localStorage.setItem(LANGUAGE.LIST + "_" + LANGUAGE.KEY, '[{"key":"vi","value":"vi-VN"},{"key":"en","value":"en-EN"}]');
        localStorage.setItem(LANGUAGE.LIST + "_" + LANGUAGE.VI.toUpperCase(), '[{"key":"vi","value":"vi-VN"},{"key":"en","value":"en-EN"}]');
        localStorage.setItem(LANGUAGE.LIST + "_" + LANGUAGE.EN.toUpperCase(), '[{"key":"vi","value":"vi-VN"},{"key":"en","value":"en-EN"}]');
        if(!localStorage.getItem(LANGUAGE.KEY)){
          localStorage.setItem(LANGUAGE.KEY, LANGUAGE.VI.toUpperCase());
        }
      }
      return {
        token,
        status:{
          success: true
        }
      };
    }));
  }


  getLoginModel(username: string, password: string, type: string, otp: string) {
    let loginModel = new LoginModel();
    loginModel.password = password;
    loginModel.grant_type = type ? type : 'password';
    // loginModel.application = config.application;
    // loginModel.otp = otp;
    // loginModel.application_version = '1.0';
    const phone = new RegExp(this.verifyService.getProperties('phone_regex'));
    const email = new RegExp(this.verifyService.getProperties('email_regex'));
    if (email.test(username)) {
      loginModel.username = username;
    }
    if (!phone.test(username) && !email.test(username)) {
      return null;
    } else {
      return loginModel;
    }
  }

  logout() {
    this.http.post(CONFIG.API.LOGOUT, {}).subscribe(
        x => {
          this.userStorage.logoutByDeleteAll();
          this.router.navigate(['/login']);
        },
        error => {
          this.userStorage.logoutByDeleteAll();
          this.router.navigate(['/login']);
        }
    );
  }

  public doRefreshToken() {
    return this.http.post(CONFIG.API.REFRESH_TOKEN,
        {refresh_token: this.userStorage.getRefreshToken(), device_token: this.userStorage.getDeviceToken()});
  }

  private updateMenuByLogin(token: any){
    let menus: ObjectsModel[] = [];
    for(var object of token.data.menu_list){
      if(USER.MENU_MODULE == object.type){
        menus.push(object);
      }
    }
    this.userStorage.setUserMenu(menus);
  }

  public getRoleList (): Observable<any> {
    return this.http.get(CONFIG.API.ROLE_LIST_OAUTH);
  }

}
