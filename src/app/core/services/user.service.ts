import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {environment} from 'src/environments/environment';
import {VerifyService} from './verify.service';
import {ToastrService} from "ngx-toastr";
import {UserStorage} from "../storage/user.storage";
import {CONFIG} from "../config/application.config";
import {UserModel} from "../models";
import {LoginModel} from "../models/login.model";
import {ResetPasswordModel} from "../models/reset.password.model";
import {ChangePasswordModel} from "../models/change.password.model";
import {USER} from "../common/constant";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private router: Router, private http: HttpClient,
              public verifyService: VerifyService,
              public userStorage: UserStorage,
              private toastrService: ToastrService){

  }

  config: any;


  redirectUrl: string;
  private url = CONFIG.API.LOGIN;
  private api = environment.api;

  public getOTPRequest(data) {
    const phoneReg = new RegExp(this.verifyService.getProperties('phone_regex'));
    const emailReg = new RegExp(this.verifyService.getProperties('email_regex'));
    let phone = '';
    let email = '';
    if (phoneReg.test(data)) {
      phone = data;
    }
    if (emailReg.test(data)) {
      email = data;
    }
    return {phone, email};
  }

  login(username: string, password: string, type: string, otp: string, model?: any): Observable<any> {
    return this.loginAction(username, password, type, otp, model, this.url);
  }

  registerUser(username: string, otp: string): Observable<any> {
    return this.loginAction(username, null, '', otp, null, CONFIG.API.REGISTER_USER);
  }

  loginAction(username: string, password: string, type: string, otp: string, model?: any, url?: string): Observable<any> {
    let loginModel;
    if (model) {
      loginModel = model;
    } else {
      loginModel = this.getLoginModel(username, password, type, otp);
      loginModel.device_token = this.userStorage.getDeviceToken();
    }

    return this.http.post<any>(url, loginModel).pipe(map(token => {
      this.userStorage.setSessionUserLogin(token);
      const mUser: UserModel = new UserModel();
      if (token && token.data.access_token) {
        mUser.token = token.data.access_token;
        mUser.token = token.data.user.changed_pasword;
        this.userStorage.setAccessToken(token.data.access_token);
        this.userStorage.setRefreshToken(token.data.refresh_token);
        this.userStorage.setAccessTokenExpiredTime(token.data.access_token_expired_time);
        this.userStorage.setRefreshTokenExpiredTime(token.data.refresh_token_expired_time);
        this.userStorage.setUserInfo(token.data.user);
        this.userStorage.setCurrentUserValue(mUser);
      }
      return token;
    }));
  }


  getLoginModel(username: string, password: string, type: string, otp: string) {
    let loginModel = new LoginModel();
    loginModel.password = password;
    loginModel.grant_type = type ? type : 'password';
    // loginModel.application = config.application;
    loginModel.otp = otp;
    // loginModel.application_version = '1.0';
    const phone = new RegExp(this.verifyService.getProperties('phone_regex'));
    const email = new RegExp(this.verifyService.getProperties('email_regex'));
    if (email.test(username)) {
      loginModel.email = username;
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
          this.router.navigate(['/login']);
        }
    );
  }

  verifyResetPassword(resetPasswordModel: ResetPasswordModel): Observable<any> {
    return this.http.post(CONFIG.API.VERIFY_RESET_PASS, resetPasswordModel);
  }

  resetPassword(resetPasswordModel: ResetPasswordModel): Observable<any> {
    return this.http.post(CONFIG.API.RESET_PASS, resetPasswordModel);
  }

  changePassword(changePasswordModel: ChangePasswordModel): Observable<any> {
    return this.http.post(CONFIG.API.CHANGE_PASS, changePasswordModel);
  }

  public getToken(): string {
    return localStorage.getItem(CONFIG.access_token);
  }

  public tokenExpired() {
    const tokenExpiredTime: number = Number.parseInt(localStorage.getItem(CONFIG.access_token_expired_time), 0);
    const tokenGetTime: number = Number.parseInt(localStorage.getItem(CONFIG.token_get_time), 0);
    if (tokenExpiredTime && tokenGetTime) {
      return (tokenGetTime + tokenExpiredTime) < Date.now();
    } else {
      return true;
    }
  }

  public doRefreshToken() {
    return this.http.post(CONFIG.API.REFRESH_TOKEN,
        {refresh_token: this.userStorage.getRefreshToken(), device_token: this.userStorage.getDeviceToken()});
  }

  public isUserAuthenticated() {
    return !this.tokenExpired();
  }

  public getOTP(email: string) {
    return this.http.post<any>(CONFIG.API.OTP, {email: email});
  }

  public register(model: LoginModel) {
    return this.http.post(CONFIG.API.REGISTER, model);
  }

  public forgot(model: any) {
    const phoneReg = new RegExp(this.verifyService.getProperties('phone_regex'));
    const emailReg = new RegExp(this.verifyService.getProperties('email_regex'));
    let phone = '';
    let email = '';
    if (phoneReg.test(model.phone)) {
      phone = model.phone;
    }
    if (emailReg.test(model.phone)) {
      email = model.phone;
    }
    model.phone = phone;
    model.email = email;
    return this.http.post(CONFIG.API.RESET_PASS, model);
  }

  public verifyToken() {
    return this.http.post(CONFIG.API.VERIFY_TOKEN, {device_token: this.userStorage.getDeviceToken()});
  }

  getConfigAPI(clientCode: string) {
    const client: any = CONFIG.CLIENT.filter(x => x.clientCode === clientCode);
    const headers: HttpHeaders = new HttpHeaders(
      {
        'Accept-Language': CONFIG.defaultLanguage,
        'Content-Type': CONFIG.contentType,
      }
    );
    return this.http.get(CONFIG.API.CONFIG + clientCode + '/dev');
  }

  getAPIs(): Observable<any> {
    return this.http.get(CONFIG.API.GET_APIS);
  }

  setConfig(data: any) {
    this.config = data;
  }

  getConfig(): Observable<any> {
    return of(this.config);
  }

  verifyUsername(username: string, url: string) {
    const phoneReg = new RegExp(this.verifyService.getProperties('phone_regex'));
    const emailReg = new RegExp(this.verifyService.getProperties('email_regex'));
    let phone = '';
    let email = '';
    if (emailReg.test(username)) {
      email = username;
    }
    return this.http.post(url, {phone, email});
  }

  makeForgot(email: string, password: string) {
    this.userStorage.makeRequestOTP(USER.OTP.FORGOT_PASSWORD, email, password);
  }

  confirmOTP(otp: string): Observable<any> {
    if (USER.OTP.FORGOT_PASSWORD == this.userStorage.getRequestOTPType()) {
      let resetPasswordModel: ResetPasswordModel = new ResetPasswordModel();
      resetPasswordModel.email = this.userStorage.getRequestOTPEmail();
      resetPasswordModel.password = this.userStorage.getRequestOTPPassword();
      resetPasswordModel.otp = otp;
      return this.resetPassword(resetPasswordModel);
    }
  }

  public getRoleList(): Observable<any> {
    return this.http.get(CONFIG.API.ROLE_LIST);
  }

  public getHRList(): Observable<any> {
    return this.http.get(CONFIG.API.HR_LIST);
  }
}
