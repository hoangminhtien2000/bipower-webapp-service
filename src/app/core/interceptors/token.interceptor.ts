import {Injectable, Injector} from '@angular/core';
import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {CONFIG} from '../config/application.config';
import {UserStorage} from "../storage/user.storage";
import {LanguageStorage} from "../storage/language.storage";

export const HEADERS = {
  AUTHORIZATION: 'Authorization',
  ACCEPT_LANGUAGE: 'Accept-Language',
  CLIENT_KEY: 'Client_key',
  CLIENT_SECRET: 'Client_secret',
  CONTENT_TYPE: 'Content-Type',
};

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router, public injector: Injector,
              private userStorage: UserStorage,
              private languageStorage: LanguageStorage) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // cosnt
    const client: any = CONFIG.CLIENT;
    const language: string = this.languageStorage.getKeyLanguage().toLowerCase();
    const languageCountry: any = CONFIG.LANGUAGE_COUNTRY;
    let headers: HttpHeaders = req.headers
      .append(HEADERS.ACCEPT_LANGUAGE, `${language}-${languageCountry}`);
    if (!req.url.includes('/otp/new')
        && !req.url.includes('/oauth/login')
        && !req.url.includes('/oauth/token')
        && !req.url.includes('/device/register')
        && !req.url.includes('/user/reset-password')
        && !req.url.includes('/user/verify-reset-password')) {
      const token = this.userStorage.getAccessToken();
      headers = headers.append(HEADERS.AUTHORIZATION, `Bearer ${token}`);
    } else {
      headers = headers.append(HEADERS.AUTHORIZATION, `Basic YXV0aG9yaXphdGlvbl9jbGllbnRfaWQ6YmNjczM=`);
    }

    const cloneReq = req.clone({headers});
    return next.handle(cloneReq);
  }
}
