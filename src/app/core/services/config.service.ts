import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {Observable} from 'rxjs';
import {VerifyService} from './verify.service';
import {CONFIG} from '../config/application.config';
import {UserStorage} from "../storage/user.storage";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor(private router: Router, private http: HttpClient,
              public verifyService: VerifyService,
              public userStorage: UserStorage,
              private toastrService: ToastrService){

  }

  getConfigHR(): Observable<any> {
    return this.http.get(CONFIG.API.CONFIG_HR);
  }

  getConfigHRWEB(): Observable<any> {
    return this.http.get(CONFIG.API.CONFIG_HR_WEB);
  }

}
