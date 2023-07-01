import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {PresenceManagementService} from "../../../../../core/services/presence-management.service";
import {removeVietnameseTones} from "../../../../../core/helper/validator-custom/ValidatorCustom";

@Component({
    selector: 'app-list-employee-modal',
    templateUrl: './list-employee-modal.component.html',
    styleUrls: ['./list-employee-modal.component.scss']
})
export class ListEmployeeModalComponent implements OnInit {
    public totalEmployeeWorkingStatusParent
    @Output() presenceList;

    public employeeListData: any[] = [];

    constructor(public modalRef: BsModalRef, private presenceService: PresenceManagementService) {
    }

    ngOnInit(): void {
        this.presenceService.attendanceSummaryToday().subscribe((res) => {
            if (res.success) {
                this.employeeListData = res.data.employeeWorkTimes;
                this.presenceList = this.employeeListData;
                this.searchingStatusPresence({stringSearch: '', status: this.totalEmployeeWorkingStatusParent})
            }
        })
    }

    closeModal() {
        this.modalRef.hide();
    }

    searchingStatusPresence(searchInfo: any) {
        if (searchInfo.status === "DEFAULT") {
            searchInfo.status = null
        }
        this.presenceList = this.employeeListData.filter(item => item['fullName'] !== undefined
            && item['fullName'] !== null
            && (!searchInfo.status || searchInfo.status == item.workType)
            && removeVietnameseTones(item['fullName'].toLowerCase()).includes(removeVietnameseTones(searchInfo.stringSearch.toLowerCase())));
    }
}
