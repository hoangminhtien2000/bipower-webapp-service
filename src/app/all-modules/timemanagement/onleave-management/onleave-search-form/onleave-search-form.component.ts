import {Component, EventEmitter, Input, OnInit, Output, OnChanges} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../core/services/onleave-management.service";
import {AddOnleaveManagementComponent} from "../add-onleave-management/add-onleave-management.component";
import * as moment from "moment";
import {Router} from '@angular/router';
import {ROLE_LIST} from "../../../../core/common/constant";
import {searchLeaveRequestModel} from "../../../../core/models/request/LeaveRequestModel";
import {UserStorage} from "../../../../core/storage/user.storage";
import { TranslateService } from "@ngx-translate/core";

@Component({
    selector: 'app-onleave-search-form',
    templateUrl: './onleave-search-form.component.html',
    styleUrls: ['./onleave-search-form.component.scss']
})
export class OnleaveSearchFormComponent implements OnInit, OnChanges {
    @Output() searchEvent = new EventEmitter<string>();
    @Input() changePageSize;
    @Input() changePage;
    public modalRef: BsModalRef;
    public listLeave;
    public date = new Date()
    public currentDate = {
        startDate: new Date(this.date.getFullYear(), this.date.getMonth(), 1),
        endDate: new Date(this.date.getFullYear(), this.date.getMonth()+1,0)
    };
    valueLeaveType = OnleaveManagementService.valueLeaveType;
    leaveStatus = OnleaveManagementService.leaveStatus;
    user = this.leaveService.getUserInfo();
    searchLeave: FormGroup
    employeeCode: "";
    employeeName: "";
    currentLeaveType = "";
    currentLeaveStatus = "";
    status = 'DEFAULT';
    typeLeave = 'DEFAULT';
    prams = searchLeaveRequestModel(this.currentDate.startDate, this.currentDate.endDate)
    // roles = this.userStorage.getUserRoles();
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));

    constructor(private _formBuilder: FormBuilder,
                private route: Router,
                public modalService: BsModalService,
                private userStorage: UserStorage,
                private leaveService: OnleaveManagementService,
                private trans: TranslateService) {
    }

    ngOnInit(): void {
        this.initializationForm()
        // this.callListForTable(this.prams);
        //// call API here
    }

    ngOnChanges() {
        this.prams.page = this.changePage
        if (this.prams.page) {
            this.prams.page = this.prams.page - 1
        }
        this.prams.size = this.changePageSize
        if (this.prams.size === 0) {
            this.prams.size = 10;
        }
        // 2 lần chạy API
        this.callListForTable(this.prams)
    }

    callListForTable(paramsSearch) {
        this.onDateRangePickerChanged()
        this.leaveService.searchLeave(paramsSearch).subscribe(res => {
            if (res) {
                this.listLeave = res.data;
                this.searchEvent.emit(this.listLeave);
            }
        })
    }

    initializationForm() {
        this.searchLeave = this._formBuilder.group({
            employeeName: ["", [Validators.maxLength(100)]],
            employeeCode: ["", [Validators.maxLength(20)]],
        })
    }
    onKeypress(event) {
        if (event.keyCode == 13) {
            this.searchListLeave();
        }
    }
    searchListLeave() {
        this.prams.leaveType = this.typeLeave == 'DEFAULT' ? null : this.typeLeave;
        this.prams.leaveStatus = this.status == 'DEFAULT' ? null : this.status;
        this.prams.employeeCode = this.employeeCode != undefined ? this.employeeCode.trim() : "";
        this.prams.employeeName = this.employeeName != undefined ? this.employeeName.trim() : "";
        this.callListForTable(this.prams)
    }

    onClickAdd() {
        this.modalRef = this.modalService.show(AddOnleaveManagementComponent, {
            initialState: {},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        this.modalRef.content.createLeaveEvent.subscribe((leave) => {
            if (leave) {
                this.addNewLeave(leave);
            }
        });
    }

    addNewLeave(leave) {
        this.searchListLeave();
    }

    onChangeStatus() {
        this.currentLeaveStatus = this.status
    }

    onChangeLeaveType() {
        this.currentLeaveType = this.typeLeave
    }

    onClickTable() {
        let url = "/layout/working-onleave-report/list";
        this.route.navigate([url]);
    }

    canSeeLeaveReport() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.C_B
        );
        return hasPermission.length > 0;
    }

    blurEmployeeName() {
        this.searchLeave.controls["employeeName"].setValue(this.searchLeave.controls["employeeName"].value ? this.searchLeave.controls["employeeName"].value.trim() : '')
    }

    blurEmployeeCode() {
        this.searchLeave.controls["employeeCode"].setValue(this.searchLeave.controls["employeeCode"].value ? this.searchLeave.controls["employeeCode"].value.trim() : '')
    }

    canSeeEmployeeCode() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.C_B ||
            role.code == ROLE_LIST.PRODUCT_OWNER ||
            role.code == ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    canSeeEmployeeName() {
        let hasPermission = this.roles.filter(role =>
            role.code == ROLE_LIST.C_B ||
            role.code == ROLE_LIST.PRODUCT_OWNER ||
            role.code == ROLE_LIST.TEAM_LEADER
        );
        return hasPermission.length > 0;
    }

    onDateRangePickerChanged() {
        this.prams.leaveFromAt = moment(this.currentDate.startDate).format("DD/MM/YYYY")
        this.prams.leaveToAt = moment(this.currentDate.endDate).format("DD/MM/YYYY")
    }
}
