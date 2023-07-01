import {ToastrService} from 'ngx-toastr';
import {PresenceService} from './../../../../core/services/presence.service';
import {summarySearchRequestModel} from './../../../../core/models/request/PresenceRequestModel';
import {Component, OnInit} from "@angular/core";
import * as moment from "moment";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {PresenceManagementService} from 'src/app/core/services/presence-management.service';
import {ListEmployeeSummaryModalComponent} from "./list-employee-summary-modal/list-employee-summary-modal.component";
import {sortByEmployeeCode} from "../../../../core/helper/presence/common";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-summary',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
    listData: any;
    public date = new Date()
    public currentDate = {
        startDate: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
        endDate: new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate())
    };
    prams = summarySearchRequestModel(this.currentDate.startDate, this.currentDate.endDate)
    workingStatus = PresenceManagementService.workingStatuses
    modalRef: BsModalRef;
    totalPage = 0;
    page = 0;
    pageSize = 10;
    numberElement = 0;

    constructor(
        private presenceSevice: PresenceService,
        public modalService: BsModalService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.fetchSummaryPresence(this.prams);
    }


    getDataTable = (data) => {
        const TYPES = {
            ATTENDANCE: "ATTENDANCE",
            ONSITE: "ONSITE",
            REMOTE: "REMOTE",
            LEAVE: "LEAVE",
            TOTAL: "TOTAL"
        }
        let ret = [];
        for (let date in data) {
            const dateObject = {date: date};
            for (const type in TYPES) {
                if (!data[date]) {
                    data[date] = {}
                }
                if (data[date][type]) {
                    dateObject[type] = data[date][type];
                } else {
                    dateObject[type] = [];
                }
            }
            ret.push(dateObject);
        }
        return ret;
    }

    fetchSummaryPresence(body) {
        if (body.startDate && !/(\d{2})\/(\d{2})\/(\d{4})/gi.test(body.startDate)) {
            body.fromDate = moment(body.startDate).format("DD/MM/yyyy");
            body.toDate = moment(body.endDate).format("DD/MM/yyyy");
        } else {
            body.fromDate = body.startDate;
            body.toDate = body.endDate;
        }
        this.presenceSevice.getStaticReport(body).subscribe(res => {
            if (res.success) {
                this.listData = this.getDataTable(res.data);
                this.listData = this.customDataTable();
            } else if (res.success == false) {
                this.toastr.error(res.message)
            }
        }, error => {
            this.toastr.error("Lỗi")
        })
    }

    customDataTable() {
        this.listData.forEach((element, key) => {
            element.date = moment(element.date).format('DD/MM/YYYY')
            element.key = key + 1;
            let total = [];
            if (element.ATTENDANCE) {
                element.ATTENDANCE.forEach(e => {
                    total.push(e)
                })
            }
            if (element.ONSITE) {
                element.ONSITE.forEach(e => {
                    total.push(e)
                })
            }
            if (element.REMOTE) {
                element.REMOTE.forEach(e => {
                    total.push(e)
                })
            }
            if (element.LEAVE) {
                element.LEAVE.forEach(e => {
                    total.push(e)
                })
            }
            element.TOTAL = total;
        })
        return this.listData;
    }
    onKeypress(event) {
        if (event.keyCode == 13) {
            this.searchSummaryReport();
        }
    }
    searchSummaryReport() {
        this.dateRangeChange();
        this.fetchSummaryPresence(this.prams);
    }

    listEmployeeSummaryModal(totalEmployeeWorkingStatusParent: any, presenceList: any) {
        presenceList = sortByEmployeeCode(presenceList);
        this.modalRef = this.modalService.show(ListEmployeeSummaryModalComponent, {
            initialState: {totalEmployeeWorkingStatusParent, presenceList},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
    }

    dateRangeChange() {
        this.prams.startDate = moment(this.currentDate.startDate).format("DD/MM/YYYY")
        this.prams.endDate = moment(this.currentDate.endDate).format("DD/MM/YYYY")
    }

    renderIndex(key, index) {
        this.numberElement = index;
        return key;
    }

    changePageSize(event) {
        this.pageSize = event;
    }

    pageChange(event) {
        this.page = event;
    }
}
