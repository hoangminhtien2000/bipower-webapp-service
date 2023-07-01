import {Injectable} from '@angular/core';
import {CONFIG} from '../config/application.config';
import {Observable, of} from 'rxjs';
import {LanguageStorage} from "../storage/language.storage";

@Injectable({
  providedIn: 'root'
})
export class VerifyService {

  constructor(private languageStorage: LanguageStorage) {
  }

  private url: string;
  private fwUrl: string;
  private application: string;
  private messageMap: Map<string, string>;
  private propertiesMap: Map<string, string>;
  private apis: any[] = [];

  getMessage(code: string): string {
    let messageObject;
    let message;
    this.getMessageMap().subscribe(data => {
        if (data) {
          messageObject = data.get('exception-message.' + this.languageStorage.getKeyLanguage().toLocaleUpperCase() + '.' + code);
          message = messageObject ? JSON.parse(messageObject).content : code;
          return message;
        } else {
          return null;
        }
      }, error => {
      },
      () => {
      });
    return message;
  }

  getProperties(code: string): string {
    let messageObject;
    // tslint:disable-next-line:no-shadowed-variable
    let config;
    this.getPropertiesMap().subscribe(data => {
        if (data) {
          messageObject = data.get(code);
          config = messageObject ? messageObject : code;
          return config;
        } else {
          return null;
        }
      }, error => {
      },
      () => {
      });
    return config;
  }


  getApis(): any[] {
    return this.apis;
  }

  setApis(value: any[]) {
    this.apis = value;
  }

  getUrl(): string {
    return this.url;
  }

  setUrl(value: string) {
    this.url = value;
  }

  getFwUrl(): string {
    return this.fwUrl;
  }

  setFwUrl(value: string) {
    this.fwUrl = value;
  }

  getApplication(): string {
    return this.application;
  }

  setApplication(value: string) {
    this.application = value;
  }

  getMessageMap(): Observable<Map<string, string>> {
    return of(this.messageMap);
  }

  setMessageMap(value: Map<string, string>) {
    this.messageMap = value;
  }

  getPropertiesMap(): Observable<Map<string, string>> {
    return of(this.propertiesMap);
  }

  setPropertiesMap(value: Map<string, string>) {
    this.propertiesMap = value;
  }
}
