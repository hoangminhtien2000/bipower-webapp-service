import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpRequest} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {environment} from 'src/environments/environment';
import {CONFIG} from "../config/application.config";

@Injectable({
    providedIn: "root",
})
export class WorkingOvertimeReportService {
    public baseUrlApi = environment.baseUrlApi + "/employee";
    public api = environment.api;

    constructor(private http: HttpClient) {
    }

    // Observable><any> 
    public getStaticReport(body: any): Observable<any> {
        return this.http.get<any>(`${this.api}/salary/overtime/statistic?page=${body.page}&size=${body.size}&year=${body.year}`, {...body});
    }

    private getUserInfo() {
        let userRoles = JSON.parse(localStorage.getItem("ROLES_LIST"));
        let role = "ROLE_" + userRoles[0];
        return {role}
    }


}