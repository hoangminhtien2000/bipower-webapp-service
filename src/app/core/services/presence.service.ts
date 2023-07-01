import { summarySearchResponse } from './../models/presence.model';
import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from 'src/environments/environment';
import {
    GetPresenceResponse,
    HistoryResponse,
    SearchPresencesResponse,
    UpdatePresenceResponse
} from "../models/response/presenceResponse.model";
import * as moment from "moment/moment";

@Injectable({
    providedIn: 'root'
})
export class PresenceService {
    public api = environment.api;

    constructor(private http: HttpClient) {
    }

    public static workTypesOnsiteRemote = [
        {value: "ONSITE", desc: "Onsite", key: "present.searchform.onsite"},
        {value: "REMOTE", desc: "Remote", key: "present.searchform.remote"},
    ]

    getCheckinTime(time) {
        return !time ? "08:00" : time;
    }

    getCheckoutTime(time) {
        return !time ? "17:30" : time;
    }

    getHistory(body): Observable<HistoryResponse> {
        return this.http.post<any>(`${this.api}/salary/attendance/history`, body);
    }

    getPresence(id): Observable<any> {
        return this.http.get<any>(`${this.api}/salary/attendance/detail/${id}`);
    }

    updatePresence(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/create-or-update-request-edit-working-time`, body);
    }

    addPresence(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/create-request-add-new-working-time`, body);
    }

    createOnsiteRemote(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/create-work-outside`, body)
    }

    updateOnsiteRemote(id: number, body): Observable<any> {
        return this.http.put<any>(`${this.api}/saga/salary/attendance/update-work-outside/${id}`, body)
    }

    getOnsiteRemoteDetail(id): Observable<any> {
        return this.http.get<any>(`${this.api}/salary/attendance/detail/${id}`);
    }

    searchOnsiteRemote(body, params): Observable<any> {
        return this.http.post<any>(`${this.api}/salary/attendance/search-work-outside-by-condition?page=${params.page}&size=${params.size}`, body)
    }

    searchPresences(body, params): Observable<any> {
        return this.http.post<any>(`${this.api}/salary/attendance/get-list-of-working-time-modifying-by-condition?page=${params.page}&size=${params.size}`, body)
    }

    approvalPresences(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/confirm-many-request-edit-working-time`, body)
    }

    approval(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/confirm-many-request-work-outside`, body)
    }

    sendApproval(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/send-request-work-outside`, body)
    }
    getStaticReport(body: any): Observable<summarySearchResponse> {
        return this.http.post<any>(`${this.api}/salary/attendance/summary-table`, body);
    }

    rejectPresences(body): Observable<any> {
        return this.http.post<any>(`${this.api}/saga/salary/attendance/confirm-many-request-edit-working-time`, body)
    }
}

