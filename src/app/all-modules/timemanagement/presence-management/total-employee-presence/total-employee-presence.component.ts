import {Component, OnInit} from '@angular/core'
import {ListEmployeeModalComponent} from "./list-employee-modal/list-employee-modal.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {PresenceManagementService} from "../../../../core/services/presence-management.service";

@Component({
    selector: 'app-total-employee-presence',
    templateUrl: './total-employee-presence.component.html',
    styleUrls: ['./total-employee-presence.component.scss']
})
export class TotalEmployeePresenceComponent implements OnInit {
    public modalRef: BsModalRef;
    public employeeWorkingStatus: any = [];
    workingStatus = PresenceManagementService.workingStatuses
    totalOnsite;
    totalRemote;
    totalLeave;
    totalAttendance;
    totalEmployee

    constructor(public modalService: BsModalService,
                private presence: PresenceManagementService,) {
    }

    ngOnInit(): void {
        this.getEmployeePresence();
    }

    listEmployeeModal(totalEmployeeWorkingStatusParent: any) {
        if (this.workingStatus) {
            this.modalRef = this.modalService.show(ListEmployeeModalComponent, {
                initialState: {totalEmployeeWorkingStatusParent},
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
            });
        }
    }

    getEmployeePresence() {
        this.presence.attendanceSummaryToday().subscribe((res) => {
            if (res.success) {
                this.employeeWorkingStatus = res.data.employeeWorkTimes;
                this.totalLeave = this.employeeWorkingStatus.filter(item => item.workType === 'LEAVE').length
                this.totalOnsite = this.employeeWorkingStatus.filter(item => item.workType === 'ONSITE').length
                this.totalAttendance = this.employeeWorkingStatus.filter(item => item.workType === 'ATTENDANCE').length
                this.totalRemote = this.employeeWorkingStatus.filter(item => item.workType === 'REMOTE').length
                this.totalEmployee = this.totalAttendance + this.totalOnsite + this.totalRemote + this.totalLeave
            }
        })
    }
}
