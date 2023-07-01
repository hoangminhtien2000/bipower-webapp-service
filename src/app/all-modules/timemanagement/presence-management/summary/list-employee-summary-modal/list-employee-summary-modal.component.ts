import {Component, OnInit, Output} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {removeVietnameseTones} from "../../../../../core/helper/validator-custom/ValidatorCustom";

@Component({
    selector: 'app-list-employee-summary-modal',
    templateUrl: './list-employee-summary-modal.component.html',
    styleUrls: ['./list-employee-summary-modal.component.scss']
})
export class ListEmployeeSummaryModalComponent implements OnInit {
    public totalEmployeeWorkingStatusParent
    @Output() presenceList;
    public employeeListData: any[] = [];

    constructor(public modalRef: BsModalRef,
        private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.employeeListData = this.presenceList;
        this.searchingStatusPresence({stringSearch: '', status: this.totalEmployeeWorkingStatusParent})
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
