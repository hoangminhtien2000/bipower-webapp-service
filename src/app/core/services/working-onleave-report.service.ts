import { Params } from '@angular/router';
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { environment } from 'src/environments/environment';
import { CONFIG } from "../config/application.config";
import { param } from 'jquery';

@Injectable({
    providedIn: "root",
})
export class WorkingOnleaveReportService {
    public baseUrlApi = environment.baseUrlApi + "/employee";
    constructor(private http: HttpClient) { }

    // Observable><any> 
    public getStaticReport(body:any, size: number, page: number): Observable<any> {
      return this.http.post<any>(CONFIG.API.WORKING_ONLEAVE.STATISTIC_ONLEAVE + `?size=${size}&page=${page}`, body);
    }

    // private getUserInfo() {
    //   let userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
    //   let userRoles = JSON.parse(localStorage.getItem("USER_ROLES"));

    //   let companyEmail = userInfo.email;
    //   let role = "ROLE_" + userRoles[0];
    //   // let companyEmail = "admin@gmail.com";
    //   // let role = "PO";
    //   return {
    //     companyEmail, role
    //   }
    // }

    
}
