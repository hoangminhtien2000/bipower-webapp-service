import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import { id } from "src/assets/all-modules-data/id";


@Injectable({
    providedIn: 'root'
})
export class OnleaveManagementService {
    public api = environment.api;

    constructor(private http: HttpClient) {
    }

    public static leaveTypes = [
        {id: 1, leaveType: "ANNUAL_LEAVE", leaveTypeName: 'workingOnleave.searchform.annualLeave'},
        {id: 2, leaveType: "ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR", leaveTypeName: 'present.searchform.ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR'},
        {id: 3, leaveType: "COMPENSATORY_LEAVE", leaveTypeName: 'workingOnleave.searchform.compensatoryLeave'},
        {id: 4, leaveType: "WEDDING_LEAVE", leaveTypeName: 'workingOnleave.searchform.marriedEmployee'},
        {id: 5, leaveType: "CHILD_WEDDING_LEAVE", leaveTypeName: 'workingOnleave.searchform.marriedEmployeeChildren'},
        {id: 6, leaveType: "FUNERAL_LEAVE", leaveTypeName: 'workingOnleave.searchform.parentMateChildPassAway'},
        {id: 7, leaveType: "UNPAID_LEAVE", leaveTypeName: 'workingOnleave.searchform.unpaidOnleave'},
        {id: 8, leaveType: "OTHER_LEAVE", leaveTypeName: 'workingOnleave.searchform.other'},
    ]

    public static valueLeaveType = [
        {value: 'DEFAULT', desc: "Chọn loại phép", key: "workingOnleave.searchform.selectOnleave"},
        {value: "ANNUAL_LEAVE", desc: "workingOnleave.searchform.annualLeave", 
        key: "workingOnleave.searchform.annualLeave"},
        {value: "COMPENSATORY_LEAVE", desc: "workingOnleave.searchform.compensatoryLeave", 
        key: "workingOnleave.searchform.compensatoryLeave"},
        {value: "WEDDING_LEAVE", desc: "workingOnleave.searchform.marriedEmployee", 
        key: "workingOnleave.searchform.marriedEmployee"},
        {value: "CHILD_WEDDING_LEAVE", desc: "workingOnleave.searchform.marriedEmployeeChildren", 
        key: "workingOnleave.searchform.marriedEmployeeChildren"},
        {value: "FUNERAL_LEAVE", desc: "workingOnleave.searchform.parentMateChildPassAway", 
        key: "workingOnleave.searchform.parentMateChildPassAway"},
        {value: "UNPAID_LEAVE", desc: "workingOnleave.searchform.unpaidOnleave", 
        key: "workingOnleave.searchform.unpaidOnleave"},
        {value: "OTHER_LEAVE", desc: "workingOnleave.searchform.other", 
        key: "workingOnleave.searchform.other"},
    ]

    public static leaveStatus = [
        {value: 'DEFAULT', desc: "Chọn trạng thái", key: "workingOnleave.searchform.selectStatus"},
        {value: "PENDING", desc: "workingOnleave.searchform.create", 
        key: "workingOnleave.searchform.create"},
        {value: "SENT_REQUEST", desc: "workingOnleave.searchform.submitRequestApprove", 
        key: "workingOnleave.searchform.submitRequestApprove"},
        {value: "LEADER_APPROVED", desc: "workingOnleave.searchform.leaderApprove", 
        key: "workingOnleave.searchform.leaderApprove"},
        {value: "APPROVED", desc: "workingOnleave.searchform.approved", 
        key: "workingOnleave.searchform.approved"},
        {value: "REJECTED", desc: "workingOnleave.searchform.rejectApproved", 
        key: "workingOnleave.searchform.rejectApproved"},
        {value: "WAITING_CANCEL_REQ_APPROVED", desc: "workingOnleave.searchform.waitingUnsubcribeConfirm", key: "workingOnleave.searchform.waitingUnsubcribeConfirm"},
        {value: "CANCEL_REQUEST_REJECTED", desc: "workingOnleave.searchform.rejectToUnsubcribe", 
        key: "workingOnleave.searchform.rejectToUnsubcribe"},
        {value: "CANCEL_REQUEST_APPROVED", desc: "workingOnleave.searchform.unsubcribed", 
        key: "workingOnleave.searchform.unsubcribed"},
    ]

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

    searchLeave(paramsSearch): Observable<any> {
        return this.http.post<any>(`${this.api}/salary/leave/find-by-condition`, paramsSearch);
    }

    createOnLeave(body: any) {
        return this.http.post<any>(`${this.api}/saga/salary/leave/create`, body)
    }

    updateLeave(id: number, body: any) {
        return this.http.post<any>(`${this.api}/saga/salary/leave/update/${id}`, body)
    }

    getLeaveDetail(id): Observable<any> {
        return this.http.get<any>(`${this.api}/salary/leave/detail/${id}`);
    }

    getTotalTimeToBox(id?: any): Observable<any> {
        const url = `${this.api}/salary/leave/get-remaining-leave-information`;
        let queryParams = id ? {"employeeId": id} : {};
        return this.http.get<any>(url,{params:queryParams});
    }

    approval(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/leave/confirm-leave-requests`, body)
    }

    sendApproval(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/leave/send-request-leaves`, body)
    }

    sendUnSubscribe(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/leave/send-request-cancel-leaves`, body)
    }
}
