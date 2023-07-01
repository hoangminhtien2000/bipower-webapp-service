import {Component, OnInit, EventEmitter, Output} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {OnleaveManagementService} from "../../../core/services/onleave-management.service";
import {Constant} from "../../../core/helper/leave/constants";

@Component({
    selector: 'app-onleave-management',
    templateUrl: './onleave-management.component.html',
    styleUrls: ['./onleave-management.component.scss']
})
export class OnleaveManagementComponent implements OnInit {
    @Output() onSubmit = new EventEmitter<any>();
    @Output() listLeave;
    @Output() paginationInfor = {
        totalPages: 0,
        totalElements: 0,
        numberOfElements: 0,
        pageSize: 10,
        number: 0
    };
    changePageSize = this.paginationInfor.pageSize;
    changePage = this.paginationInfor.number;
    modalRef: BsModalRef;
    public data: any = [];

    constructor(public modalService: BsModalService,
                private leaveService: OnleaveManagementService,
    ) {
    }

    ngOnInit(): void {
        this.getTotalTimeToBox();
    }

    searchListLeave(listLeave) {
        this.listLeave = listLeave.content;
        this.paginationInfor = listLeave
        this.paginationInfor.pageSize = listLeave.pageable.pageSize
        this.paginationInfor.number = listLeave.pageable.pageNumber
    }

    pageEventChange(pageSize) {
        this.changePageSize = pageSize;
    }

    pageChangeEventChange(pageChangeEvent) {
        this.changePage = pageChangeEvent;
    }

    getTotalTimeToBox() {
        this.leaveService.getTotalTimeToBox().subscribe((res) => {
            this.data = res.data;
        })
    }

    renderAnnualLeaveRemaining() {
        let annualLeave = this.data?.find(element => element.leaveType === Constant.ANNUAL_LEAVE);
        return annualLeave ? annualLeave.totalLeaveTime - annualLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING
    }

    renderAnnualLeave() {
        let annualLeave = this.data?.find(element => element.leaveType === Constant.ANNUAL_LEAVE);
        return annualLeave ? annualLeave.totalLeaveTime : Constant.INIT_TIME_REMAINING
    }

    renderCompensatoryLeaveRemaining() {
        let compensatoryLeave = this.data?.find(element => element.leaveType === Constant.COMPENSATORY_LEAVE);
        return compensatoryLeave ? compensatoryLeave.totalLeaveTime - compensatoryLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING
    }
}
