import {TranslateService} from '@ngx-translate/core';
import {Component, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {AllModulesService} from "../../all-modules.service";
import {WorkingOnleaveReportService} from 'src/app/core/services/working-onleave-report.service';
import * as moment from 'moment';
import {searchWorkingLeaveReportModel} from "../../../core/models/request/LeaveRequestModel"

@Component({
    selector: 'app-working-onleave-report-list',
    templateUrl: './working-onleave-report-list.component.html',
    styleUrls: ['./working-onleave-report-list.component.css']
})
export class WorkingOnleaveReportListComponent implements OnInit {
    listData = [];
    fullname = "";
    year = moment(new Date()).year();
    month = moment(new Date()).month() + 1;
    size = 10;
    page = 0;
    pageSize: any = 10;
    totalElements: number = 0;
    searchLeaveForm: FormGroup;
    currentDate: any = new Date();
    constructor(
        private formBuilder: FormBuilder,
        private srvModuleService: AllModulesService,
        private service: WorkingOnleaveReportService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.validateUpdateLeaveForm();
        let bodyRequest = searchWorkingLeaveReportModel(this.year, this.month, this.fullname)
        this.fetchWorkingLeaveReport(bodyRequest);
    }

    validateUpdateLeaveForm() {
        this.searchLeaveForm = this.formBuilder.group({
            month: [this.currentDate, []],
            year: [this.currentDate, []],
            fullname: [this.fullname,[]],
        });
        return !this.searchLeaveForm.invalid;
    }

    fetchWorkingLeaveReport(bodyRequest) {        
        this.service.getStaticReport(bodyRequest, this.size, this.page > 1 ? this.page - 1: 0).subscribe(res => {
            if (res.success) {
                this.listData = res.data.content;
                this.totalElements = res.data.totalElements;
            } else if(res.success == false) {
                this.toastr.error(res.message)
            }
        }, error => {
            this.toastr.error("Lỗi")
        })
    }
    onKeypress(event) {
        if (event.keyCode == 13) {
            this.searchWorkingLeaveReport();
        }
    }
    searchWorkingLeaveReport() {
        let month = this.searchLeaveForm.value.month.getMonth() + 1;
        let years = this.searchLeaveForm.value.year.getFullYear();
        let bodyRequest = searchWorkingLeaveReportModel(years, month, this.fullname)
        this.fetchWorkingLeaveReport(bodyRequest);
    }

    selectOption(number) {
        this.size = number;
        let bodyRequest = searchWorkingLeaveReportModel(this.year, this.month, this.fullname)
        this.fetchWorkingLeaveReport(bodyRequest);
    }

    changePage(page) {
        this.page = page;
        let bodyRequest = searchWorkingLeaveReportModel(this.year, this.month, this.fullname)
        this.fetchWorkingLeaveReport(bodyRequest);
    }

    
    blurEmployeeName() {
        this.searchLeaveForm.controls["fullname"].setValue(this.searchLeaveForm.controls["fullname"].value.trim())
    }

    renderIndex(index) {
        if(this.page >= 1) {
            return (this.page - 1) + "" + index
        } else{
            return index;
        }
    }

}
