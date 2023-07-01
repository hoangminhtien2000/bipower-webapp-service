import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {environment} from 'src/environments/environment';
import {UserStorage} from "../storage/user.storage";

@Injectable({
    providedIn: 'root'
})
export class TimeManagementService {
    public api = environment.api;

    constructor(private http: HttpClient, private userStorage: UserStorage) {
    }

    headers = new HttpHeaders()
        .set("Content-Type", "application/json; charset=utf-8")
        .set("Access-Control-Allow-Origin", "*")
    httpOptions = {
        headers: this.headers,
    };

    public static departmentList = [{}]

    public static status = [
        {value: 'DEFAULT', desc: "Chọn trạng thái", key: "workingOvertime.searchForm.selectStatus"},
        {value: "PENDING", desc: "Tạo mới", key: "workingOvertime.searchForm.create"},
        {value: "SENT_REQUEST", desc: "Đã gửi yêu cầu", key: "workingOvertime.searchForm.sendRequest"},
        {value: "LEADER_APPROVED", desc: "Trưởng nhóm đã phê duyệt", key: "workingOvertime.searchForm.leaderApprove"},
        {value: "APPROVED", desc: "Được phê duyệt", key: "workingOvertime.searchForm.approved"},
        {value: "REJECTED", desc: "Từ chối phê duyệt", key: "workingOvertime.searchForm.rejected"},
    ];

    // Handling Errorsư
    private handleError(error: any) {
        return throwError(error);
    }

    public getPageSearch(model): Observable<any> {
        return this.http.post<any>(`${this.api}/salary/overtime/search?page=${model.page}&size=${model.size}`, {...model});
    }

    public create(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/overtime/create`, {...body});
    }

    public update(body: any, id: number): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/overtime/update/${id}`, {...body});
    }

    public findById(id: number): Observable<any> {
        return this.http.get<any>(`${this.api}/salary/overtime/detail/${id}`);
    }

    public getUserInfo() {
        let roles = this.userStorage.getUserRoles().map(el => el.code);
        return {roles}
    }

    public getUserData() {
        let userData = JSON.parse(this.userStorage.getUserData());
        if (userData && userData.actionUser && userData.actionUser.email) {
            return userData;
        }
        return null;
    }

    public hasRole(role: string) {
        return this.getUserInfo().roles.indexOf(role) >= 0;
    }

    public sendManyOvertimeRequestToApprover(data: any): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/overtime/send-many-overtime-req-to-approver`, {...data})
    }

    public confirManyOvertimeRequest(data: any): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/overtime/confirm-many-overtime-request`, {...data})
    }
}
