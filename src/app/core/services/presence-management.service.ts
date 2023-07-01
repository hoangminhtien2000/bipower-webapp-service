import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
    providedIn: 'root'
})
export class PresenceManagementService {
    public api = environment.api;

    constructor(private http: HttpClient,
                private translate: TranslateService) {
    }

    public static workTypesOnsiteRemote = [
        {code: 'DEFAULT', workingStatusName: 'timeManager.search_form.choose_working_form'},
        {code: 'ONSITE', workingStatusName: 'Onsite'},
        {code: 'REMOTE', workingStatusName: 'Remote'},
    ]

    public static workingStatuses = [
        {code: 'DEFAULT', workingStatusName: "timeManager.workingStatuses.choose_status"},
        {code: 'ATTENDANCE', workingStatusName: "timeManager.workingStatuses.working_in_the_office"},
        {code: 'REMOTE', workingStatusName: "timeManager.workingStatuses.remote"},
        {code: 'ONSITE', workingStatusName: "timeManager.workingStatuses.onsite" },
        {code: 'LEAVE', workingStatusName: "timeManager.workingStatuses.off"},
    ]

    public static statusRegistersOS = [
        {code: 'DEFAULT', workingStatusName: "timeManager.workingStatuses.choose_status"},
        {code: 'PENDING', workingStatusName: 'timeManager.workingStatuses.create'},
        {code: 'SENT_REQUEST', workingStatusName: 'timeManager.workingStatuses.submitRequestApprove'},
        {code: 'REJECTED', workingStatusName: 'timeManager.workingStatuses.rejectApproved'},
        {code: 'LEADER_APPROVED', workingStatusName: 'timeManager.workingStatuses.leaderApprove'},
        {code: 'APPROVED', workingStatusName: 'timeManager.workingStatuses.approved'},
    ]


    public static statusRegistersOSCOO = [
        {code: 'DEFAULT', workingStatusName: "timeManager.search_form.choose_status"},
        {code: 'REJECTED', workingStatusName:  "workingOnleave.searchform.rejectApproved"},
        {code: 'LEADER_APPROVED', workingStatusName: "workingOnleave.searchform.leaderApprove"},
        {code: 'APPROVED', workingStatusName: "workingOnleave.searchform.approved"},
    ]

    public static listTeam = [
        {team: 'Nhóm: 2F', numberEmployee: "5/10"},
        {team: 'Nhóm: marketing', numberEmployee: "9/10"},
        {team: 'Nhóm: Mobix', numberEmployee: "4/15"},
        {team: 'Nhóm: Digimon', numberEmployee: "3/5"},
        {team: 'Nhóm: Hr', numberEmployee: "5/10"},
        {team: 'Nhóm: VAS', numberEmployee: "2/7"},
    ]

    checkIn() {
        return this.http.post<any>(`${this.api}/salary/attendance/checkin`, {})
    }

    checkOut() {
        return this.http.post<any>(`${this.api}/salary/attendance/checkout`, {})
    }

    getInformationCheckinCheckoutToday() {
        return this.http.get<any>(`${this.api}/salary/attendance/information-checkin-checkout-today`)
    }

    attendanceSummaryToday() {
        return this.http.get<any>(`${this.api}/salary/attendance/summary-today`)

    }
}
