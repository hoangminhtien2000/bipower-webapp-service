import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OvertimeManagementService {
    public api = environment.api;

    constructor(private http: HttpClient) {
    }


    public hasRole(role: string) {
        return this.getUserInfo().role == role;
    }

    public getUserInfo() {
        let userInfo = JSON.parse(localStorage.getItem("USER_INFO"));
        let userRoles = JSON.parse(localStorage.getItem("USER_ROLES"));

        let role = userRoles[0] ? ("ROLE_" + userRoles[0]) : "";
        let companyEmail = userInfo?.email;
        return {
            role: role, companyEmail: companyEmail
        }
    }
    sendUnSubscribe(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/leave/send-request-cancel-leaves`, body)
    }
}
