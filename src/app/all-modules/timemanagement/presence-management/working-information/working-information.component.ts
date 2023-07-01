import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {PresenceManagementService} from "../../../../core/services/presence-management.service";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {MemberOfTeamDetailsComponent} from "./member-of-team-details/member-of-team-details.component";
import {ROLE_LIST} from "../../../../core/common/constant";

@Component({
    selector: 'app-working-information',
    templateUrl: './working-information.component.html',
    styleUrls: ['./working-information.component.css']
})
export class WorkingInformationComponent implements OnChanges {
    listTeams = PresenceManagementService.listTeam
    openAccordion = []
    public employeeWorkingStatus: any = [];
    public summaryTeamStatus = {total: 0, attendance: 0, onsite: 0, remote: 0, leave: 0};
    @Input() checkInOutData
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));

    constructor(private presence: PresenceManagementService,
                public modalRef: BsModalRef,
                public modalService: BsModalService,) {
    }

    // ngOnInit(): void {
    //     // this.getEmployeePresence();
    // }

    ngOnChanges() {
        this.getEmployeePresence()
    }

    showWorkingHistory(value) {
        this.modalRef = this.modalService.show(MemberOfTeamDetailsComponent, {
            initialState: {value},
            class: 'modal-left modal-dialog-centered w-35 max-width-modal expand',
            ignoreBackdropClick: true
        });
    }

    getCardlass(workType) {
        if (workType === "ATTENDANCE")
            return 'green';
        else if (workType === "REMOTE")
            return 'blue';
        else if (workType === "ONSITE")
            return 'yellow';
        else return 'red';
    }

    getTooltipClassBox(workType) {
        if (workType === "ATTENDANCE")
            return 'boxGreenToolTip';
        else if (workType === "REMOTE")
            return 'boxBlueToolTip';
        else if (workType === "ONSITE")
            return 'boxOrangeToolTip';
        else if (workType === "OVERTIME")
            return 'boxPurpleToolTip'
        else return 'boxRedToolTip';
    }

    getEmployeePresence() {
        this.presence.attendanceSummaryToday().subscribe((res) => {
            if (res.success) {
                this.employeeWorkingStatus = res.data.teamMemberAttendances;
                this.employeeWorkingStatus.forEach(((team: any) => {
                    team.total = team.memberAttendanceDetails.length;
                    team.attendance = team.memberAttendanceDetails.filter(employee => employee.workTypeWhenStartDay == "ATTENDANCE").length;
                    team.onsite = team.memberAttendanceDetails.filter(employee => employee.workTypeWhenStartDay == "ONSITE").length;
                    team.remote = team.memberAttendanceDetails.filter(employee => employee.workTypeWhenStartDay == "REMOTE").length;
                    team.leave = team.memberAttendanceDetails.filter(employee => employee.workTypeWhenStartDay == "LEAVE").length;
                    this.summaryTeamStatus.total += team.total;
                    this.summaryTeamStatus.attendance += team.attendance;
                    this.summaryTeamStatus.onsite += team.onsite;
                    this.summaryTeamStatus.remote += team.remote;
                    this.summaryTeamStatus.leave += team.leave;
                }))
            }
        })
    }

    renderTime = (time) => {
        if (time === undefined) {
            time = "--:--"
        }
        return time.slice(0, time.length - 3)
    }

    toolTipPermiss() {
        return this.hasRole(ROLE_LIST.C_B) || this.hasRole(ROLE_LIST.COO);
    }

    hasRole(roleCode) {
        let roles = this.roles.filter(role =>
            role.code === roleCode
        );
        return roles.length > 0;
    }
}
