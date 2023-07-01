import {Injectable} from '@angular/core';
import {CanActivate, Router,} from '@angular/router';
import {UserStorage} from "../storage/user.storage";
import {LanguageStorage} from "../storage/language.storage";
import {LanguageService} from "../services/language.service";
import {PropertiesStorage} from "../storage/properties.storage";
import {ConfigService} from "../services/config.service";
import {VerifyService} from "../services/verify.service";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate {
  constructor(public router: Router,
              private languageStorage: LanguageStorage,
              private propertiesStorage: PropertiesStorage,
              private configService: ConfigService,
              private languageService: LanguageService,
              private verifyService: VerifyService,
              private translate: TranslateService,
              private userStorage: UserStorage) {}

  canActivate(): boolean {
    let url = window.location.href;
    if (url.includes('login')) {
      return true;
    }
    if (this.userStorage.checkExistsIsLogin()) {
      return true;
    }
    return true;
  }
}
