import {Component, EventEmitter, OnChanges, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import {Constant} from 'src/app/core/helper/validator-custom/ValidatorCustom';
import {TimeManagementService} from "../../../../core/services/time-management.service";
import {ApproveFormComponent} from '../approve-form/approve-form.component';
import {RejectFormComponent} from '../reject-form/reject-form.component';
import {OT_STATUS, ROLE_LIST} from "../../../../core/common/constant";
import {
    dayOvertimeInvalid,
    endHourOffical,
    holidayTimeRule,
    startHourOffical
} from "../../../../core/helper/overtimeCustomValidate";

declare const $: any;

@Component({
    selector: 'app-add-or-edit-ot-managerment',
    templateUrl: './add-or-edit-ot-managerment.component.html',
    styleUrls: ['./add-or-edit-ot-managerment.component.scss']
})
export class AddOrEditOtManagermentComponent implements OnInit {
    @Output() result = new EventEmitter<any>();
    @Output() modalResult = new EventEmitter<any>();
    public currentDate = new Date();
    public companyEmail = null;
    public startDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    public endDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDate.getDate());
    public defaultRangeDate = [];
    public state = "save";
    form: FormGroup;
    formSearch: FormGroup;
    value: any;
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    ROLE_FULE = [ROLE_LIST.CEO, ROLE_LIST.CFO, ROLE_LIST.CMO, ROLE_LIST.COO, ROLE_LIST.HRA_LEADER, ROLE_LIST.PRM_LEADER, ROLE_LIST.CMO];
    startTime = "";
    endTime = "";
    public today: Date = new Date();
    public currentDay: number = this.today.getDate();
    public minDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), this.currentDay -7);

    constructor(
        private fb: FormBuilder,
        public modalRef: BsModalRef,
        public modalService: BsModalService,
        private timeManagerment: TimeManagementService) {
    }

    ngOnInit() {
        this.formSearch = this.fb.group({
            note: ["", [Validators.required, Validators.maxLength(500)]]
        });
        this.form = this.fb.group({
            id: ["", []],
            requestCode: ["", [Validators.required, Validators.maxLength(20), Validators.pattern(Constant.PROJECT_NAME_RULE)]],
            projectName: ["", [Validators.required, Validators.maxLength(200), Validators.pattern(Constant.PROJECT_NAME_RULE)]],
            reason: ["", [Validators.required, Validators.maxLength(500)]],
            overtimeFromAt: [this.startDate, [Validators.required, dayOvertimeInvalid(), holidayTimeRule()]],
            overtimeToAt: [],
            startTime: [this.startTime, [Validators.required, startHourOffical()]],
            endTime: [this.endTime, [Validators.required, endHourOffical()]]
        });
        if (this.value) {
            let [date1, startTime] = this.value.overtimeFromAt.split(" ");
            let [date2, endTime] = this.value.overtimeToAt.split(" ");
            this.state = "save";
            this.form.setValue({
                id: this.value.id,
                requestCode: this.value.requestCode,
                projectName: this.value.projectName,
                reason: this.value.reason,
                overtimeFromAt: this.convertStringToDate(this.value.overtimeFromAt),
                overtimeToAt: this.convertStringToDate(this.value.overtimeToAt),
                startTime: startTime,
                endTime: endTime,
            });
        } else {
            this.state = "isNew";
        }
    }

    // validate Time start
    compareStartAndEndTime() {
        if (this.startTime && this.endTime) {
            let dateCurrent = moment().format('DD/MM/YYYY');
            let start = moment((dateCurrent + ' ' + this.startTime), 'DD/MM/YYYY HH:mm');
            let end = moment((dateCurrent + ' ' + this.endTime), 'DD/MM/YYYY HH:mm');
            return end.diff(start, 'minutes') <= 0;
        } else {
            return false;
        }
    }

    minApplyFormHour() {
        if (this.startTime && this.endTime) {
            let dateCurrent = moment().format('DD/MM/YYYY');
            let start = moment((dateCurrent + ' ' + this.startTime), 'DD/MM/YYYY HH:mm');
            let end = moment((dateCurrent + ' ' + this.endTime), 'DD/MM/YYYY HH:mm');
            return end.diff(start, 'hours') < 1;
        } else {
            return false;
        }
    }

    minApplyFormMin() {
        if (this.startTime && this.endTime) {
            let dateCurrent = moment().format('DD/MM/YYYY');
            let start = moment((dateCurrent + ' ' + this.startTime), 'DD/MM/YYYY HH:mm');
            let end = moment((dateCurrent + ' ' + this.endTime), 'DD/MM/YYYY HH:mm');
            return end.diff(start, 'hours') > 3;
        } else {
            return false;
        }
    }

    minApplyFormMinHoliday() {
        if (this.startTime && this.endTime) {
            let dateCurrent = moment().format('DD/MM/YYYY');
            let start = moment((dateCurrent + ' ' + this.startTime), 'DD/MM/YYYY HH:mm');
            let end = moment((dateCurrent + ' ' + this.endTime), 'DD/MM/YYYY HH:mm');
            return end.diff(start, 'hours') > 8;
        } else {
            return false;
        }
    }

    // validate Time end

    isCreatedByMyself(email: string) {
        if (this.timeManagerment.getUserData()) {
            const userData = this.timeManagerment.getUserData();
            if (userData && userData.actionUser && userData.actionUser.email == email) {
                return true;
            }
        }
        return false;
    }

    hasRoleEmployee() {
        let roles = [ROLE_LIST.PRM_LEADER, ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.HRA_LEADER, ROLE_LIST.CEO,
            ROLE_LIST.COO, ROLE_LIST.CFO, ROLE_LIST.CMO, ROLE_LIST.CTO];
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.timeManagerment.hasRole(role)) {
                return false;
            }
        }
        return true;
    }

    onBlur(fieldName: string) {
        let newValue = "";
        if (this.form.getRawValue() && this.form.getRawValue()[fieldName] && typeof this.form.getRawValue()[fieldName] == "string") {
            newValue = this.form.getRawValue()[fieldName].trim();
        }
        this.form.setValue({
            ...this.form.getRawValue(),
            [fieldName]: newValue
        });
    }

    validateForm() {
        this.form.markAllAsTouched();
        const invalid = [];
        const controls = this.form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.form.errors;
    }

    onSave() {
        if (this.validateForm()) {
            let overtimeFromAt = this.convertDateToString(this.form.getRawValue().overtimeFromAt) + " " + this.startTime;
            let overtimeToAt = this.convertDateToString(this.form.getRawValue().overtimeFromAt) + " " + this.endTime;
            this.result.emit({
                data: {...this.form.getRawValue(), overtimeFromAt, overtimeToAt, sendApproveReq: false},
                action: this.state
            });
        }
    }

    convertDateToString(date: Date) {
        return moment(date).format("DD/MM/yyyy");
    }

    convertStringToDate(str: string = "") {
        let pattern = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/gi;
        if (pattern.test(str)) {
            let time = str.split(" ")[1];
            let dates = str.split(" ")[0];

            let date = dates.split("/")[0];
            let month = dates.split("/")[1];
            let year = dates.split("/")[2];

            let hour = time.split(":")[0];
            let minute = time.split(":")[1];

            return new Date(parseInt(year), parseInt(month) - 1, parseInt(date), parseInt(hour), parseInt(minute), 0);
        }
        return null;
    }

    onSaveAndApprove() {
        if (this.validateForm()) {
            let overtimeFromAt = this.convertDateToString(this.form.getRawValue().overtimeFromAt) + " " + this.startTime;
            let overtimeToAt = this.convertDateToString(this.form.getRawValue().overtimeFromAt) + " " + this.endTime;
            this.result.emit({
                data: {...this.form.getRawValue(), overtimeFromAt, overtimeToAt, sendApproveReq: true},
                action: "saveAndApprove"
            });
        }
    }

    hasRole(role: string) {
        return this.timeManagerment.hasRole(role);
    }

    hasPermission(roles: string[]) {
        for (let index = 0; index < roles.length; index++) {
            const role = roles[index];
            if (this.timeManagerment.hasRole(role)) {
                return true;
            }
        }
        return false;
    }

    isShowSaveAndApprove() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.PRM_LEADER
        );
        return hasPermission.length <= 0;
    }

    get isShow() {
        if (!this.value) {
            return true;
        }
        // let val =this.value  && this.value.status;
        let val = this.value.status;
        if (this.hasPermission(["C_B", "CEO", "COO", "CFO", "CMO", "CTO", "HRA_LEADER"]) && (val.indexOf("_REJECTED") >= 0 || val.indexOf("PENDING") >= 0)) {
            this.form.enable();
            return true;
        } else if (this.hasPermission(["PRODUCT_OWNER", "TEAM_LEADER"])) {
            if (this.isCreatedByMyself(this.companyEmail) && [OT_STATUS.REJECTED, OT_STATUS.PENDING].indexOf(val) >= 0) {
                this.form.enable();
                return true;
            } else {
                this.form.disable();
                return false;
            }
        } else if (this.hasPermission(["PRM_LEADER"])) {
            this.form.disable();
            return false;
        } else if ((val.indexOf("WAITING_") >= 0 || val == "PRM_APPROVED") && this.hasPermission(["ROLE_EMPLOYEE", "PRODUCT_OWNER", "TEAM_LEADER", "CEO", "COO", "CFO", "CMO", "CTO", "C_B", "HRA_LEADER"]) && this.hasRoleEmployee()) {
            this.form.disable();
            return false;
        } else if (val.indexOf("_REJECTED") >= 0 && this.hasPermission(["PRODUCT_OWNER", "TEAM_LEADER"])) {
            this.form.disable();
            return false;
        } else if (this.hasRoleEmployee()) {
            if ([OT_STATUS.PENDING, OT_STATUS.REJECTED].indexOf(val) >= 0 && this.isCreatedByMyself(this.companyEmail)) {
                this.form.enable();
                return true;
            } else {
                this.form.disable();
                return false;
            }
        } else {
            this.form.enable();
        }

        return true;
    }

    get isShowApprove() {
        if (!this.value) {
            return false;
        }
        if (this.hasPermission([ROLE_LIST.PRODUCT_OWNER, ROLE_LIST.TEAM_LEADER]) && this.value.status == OT_STATUS.SENT_REQUEST) {
            return true;
        } else if (this.hasPermission([...this.ROLE_FULE]) && [OT_STATUS.LEADER_APPROVED, OT_STATUS.SENT_REQUEST].indexOf(this.value.status) >= 0) {
            return true;
        }
        return false;
    }

    onReject() {
        this.modalRef = this.modalService.show(RejectFormComponent, {
            initialState: {value: null},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        if (this.modalRef) {
            (<RejectFormComponent>this.modalRef.content).result.subscribe((res: any) => {
                this.modalResult.emit({
                    data: {...this.form.getRawValue(), sendApproveReq: true, status: this.value.status, note: res.note},
                    action: "reject"
                });
                this.modalRef.hide();
            });
        }
    }

    onApprove() {
        this.modalRef = this.modalService.show(ApproveFormComponent, {
            initialState: {value: null},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true
        });
        if (this.modalRef) {
            (<ApproveFormComponent>this.modalRef.content).result.subscribe((res: any) => {
                this.modalResult.emit({
                    data: {...this.form.getRawValue(), sendApproveReq: true, status: this.value.status},
                    action: "approve"
                });
                this.modalRef.hide();
            });
        }
    }

    closeModal() {
        this.modalService.hide();
    }

    isRequire(fieldName: string) {
        return this.form?.controls[fieldName].hasValidator(Validators.required);
    }

    catchStartTime($event) {
        this.startTime = $event.target.value
    }

    catchEndTime($event) {
        this.endTime = $event.target.value
    }
}
