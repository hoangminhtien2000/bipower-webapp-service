import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSevice {

  constructor() {
  }

  phone: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  phone$: Observable<any> = this.phone.asObservable();

  username: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  username$: Observable<any> = this.username.asObservable();

  reset: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  reset$: Observable<any> = this.reset.asObservable();

  changedPass: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  changedPass$: Observable<any> = this.changedPass.asObservable();

  language: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  language$: Observable<any> = this.language.asObservable();

  private checkGetOTP = false;
  private tabCodeSource = new BehaviorSubject<any>([]);
  currentTabCode = this.tabCodeSource.asObservable();

  changeTabCode(code: string): void {
    this.tabCodeSource.next(code)
  }

  getCheckGetOTP(): boolean {
    return this.checkGetOTP;
  }

  setCheckGetOTP(value: boolean) {
    this.checkGetOTP = value;
  }

  setService(model: any) {
    this.phone.next(model);
  }

  setUserName(model: any) {
    this.username.next(model);
  }

  setDataReset(model: any) {
    this.reset.next(model);
  }

  setChangedPass(data: any) {
    this.changedPass.next(data);
  }

  setLanguage(data: any) {
    this.language.next(data);
  }
}
