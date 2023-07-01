import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {OnleaveManagementService} from "../../../../core/services/onleave-management.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import {Constant} from "../../../../core/helper/leave/constants";
import {getDaysByHours, getLeaveTime} from "../../../../core/helper/leave/calculateLeaveHours";
import * as moment from "moment";
import {ToastrService} from "ngx-toastr";
import {initLeave, newLeaveRequestModel} from "../../../../core/models/request/LeaveRequestModel";
import {
    endBiggerThanEndWorkingDay,
    noLeave,
    noLunchTime,
    noWorkingDays,
    startDateLessThanEndDate,
    startLessThanStartWorkingDay
} from "../../../../core/helper/leave/validateUpdateLeaveForm";
import {ROLE_LIST} from "../../../../core/common/constant";
import {UserStorage} from "../../../../core/storage/user.storage";
import {sortByEmployeeCode} from "../../../../core/helper/presence/common";
import {EmployeeService} from "../../../../core";
import {Select2OptionData} from "ng-select2";
import {TranslateService} from "@ngx-translate/core";
import { id } from 'src/assets/all-modules-data/id';

@Component({
    selector: 'app-add-onleave-management',
    templateUrl: './add-onleave-management.component.html',
    styleUrls: ['./add-onleave-management.component.scss']
})
export class AddOnleaveManagementComponent implements OnInit {
    leaveTypes = OnleaveManagementService.leaveTypes;
    public onLeaveLeaveType = OnleaveManagementService.valueLeaveType;
    updateLeaveForm: FormGroup;
    currentLeaveType;
    leave = initLeave();
    user = this.userStorage.getUserInfo();
    roles = this.userStorage.getUserRoles();
    @Output() createLeaveEvent = new EventEmitter<any>();
    employeeId = null;
    employees: Array<Select2OptionData>;
    myEmployeeId = null;
    today = moment()
    constructor(public modalRef: BsModalRef,
                public options: ModalOptions,
                private toastr: ToastrService,
                private employeeService: EmployeeService,
                private fb: FormBuilder,
                public modalService: BsModalService,
                private userStorage: UserStorage,
                private leaveService: OnleaveManagementService,
                private translate: TranslateService
    ) {
        this.fetchEmployees();
    }

    ngOnInit(): void {
        this.setCurrentLeaveType(Constant.INIT_TIME_REMAINING, this.leave.leaveType);
        this.validateUpdateLeaveForm();
        if (this.hasRole(ROLE_LIST.C_B)) {
            this.today = null;
        }
    }

    fetchEmployees() {
        this.employeeService.getEmployees().subscribe(res => {
            if (res.success) {
                if (res.data.employeeInfoResps.length > 0) {
                    this.employees = this.customToSelect2OptionData(sortByEmployeeCode(res.data.employeeInfoResps));
                    this.employeeId = this.findStartEmployeeId(res.data.employeeInfoResps);
                }
            }
        })
    }

    findStartEmployeeId(employeeInfoResps) {
        let employee = employeeInfoResps.find(employeeElement => employeeElement.employeeCode == this.user.userCode)
        if (employee) {
            this.myEmployeeId = employee.employeeId;
            return employee.employeeId;
        } else {
            return employeeInfoResps.shift().employeeId
        }
    }

    customToSelect2OptionData(employees): Array<Select2OptionData> {
        let select2OptionData = []
        employees.forEach(employee => {
            let newSelect2Option = {
                id: String(employee.employeeId),
                text: employee.employeeCode + ' - ' + employee.lastName + ' ' + employee.firstName
            }
            select2OptionData.push(newSelect2Option);
        })
        return select2OptionData;
    }

    searchByEmployee(value) {
        this.employeeId = value;
        this.getTotalTimeToBoxFuction(value);
    }

    getTotalTimeToBoxFuction(id) {
        this.leaveService.getTotalTimeToBox(id).subscribe((res) => {
            if (res && res.data && res.success) {
                this.currentLeaveType.timeRemaining = this.getTimeRemaining(this.leave.leaveType, res.data)
            } else {
                this.toastr.success(res, this.translate.instant("timeManager.add_onleave_management.error"))
            }
        })
    }

    selectLeaveType(selectedLeaveType) {
        this.fetchLeaveType(selectedLeaveType, this.translate);
    }

    setCurrentLeaveType(timeRemaining, selectedLeaveType) {
        this.currentLeaveType = {timeRemaining: timeRemaining, leaveType: selectedLeaveType}
    }

    fetchLeaveType(leaveType, translate) {
        this.leaveService.getTotalTimeToBox(this.employeeId).subscribe(res => {
            if (res.success) {
                this.setCurrentLeaveType(this.getTimeRemaining(leaveType, res.data), leaveType);
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }

    getTimeRemaining(selectedLeaveType, data) {
        let annualLeave = data.find(element => element.leaveType === Constant.ANNUAL_LEAVE);
        let annualLeaveRemaining = annualLeave ? annualLeave.totalLeaveTime - annualLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING
        let annualLeaveRemainPreviousYear = data.find(element => element.leaveType === Constant.ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR);
        let annualLeaveRemainPreviousYearRemaining = annualLeaveRemainPreviousYear ? annualLeaveRemainPreviousYear.totalLeaveTime - annualLeaveRemainPreviousYear.leaveTimeUsed : Constant.INIT_TIME_REMAINING
        let compensatoryLeave = data.find(element => element.leaveType === Constant.COMPENSATORY_LEAVE);
        let compensatoryLeaveRemaining = compensatoryLeave ? compensatoryLeave.totalLeaveTime - compensatoryLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING

        switch (selectedLeaveType) {
            case Constant.ANNUAL_LEAVE :
                return annualLeaveRemaining;
            case Constant.ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR :
                return annualLeaveRemainPreviousYearRemaining;
            case Constant.COMPENSATORY_LEAVE :
                return compensatoryLeaveRemaining;
            case Constant.WEDDING_LEAVE :
                return Constant.WEDDING_LEAVE_REMAINING;
            case Constant.CHILD_WEDDING_LEAVE :
                return Constant.CHILD_WEDDING_LEAVE_REMAINING;
            case Constant.FUNERAL_LEAVE :
                return Constant.FUNERAL_LEAVE_REMAINING;
            case Constant.UNPAID_LEAVE :
                return Constant.UNPAID_LEAVE_REMAINING;
            case Constant.OTHER_LEAVE :
                return Constant.OTHER_LEAVE_REMAINING;
            default :
                return Constant.INIT_TIME_REMAINING;
        }
    }

    validateUpdateLeaveForm() {
        this.updateLeaveForm = this.fb.group({
            leaveType: [this.leave.leaveType, [Validators.required]],
            leaveHour: [this.leave.leaveHour, [noLeave()]],
            timeRemaining: [this.currentLeaveType.timeRemaining, [Validators.required]],
            leaveTime: [this.leave.leaveTime, [Validators.required, startDateLessThanEndDate(), startLessThanStartWorkingDay(), endBiggerThanEndWorkingDay(), noLunchTime(), noWorkingDays()]],
            reason: [this.leave.reason, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.updateLeaveForm.invalid;
    }

    showTimeRemainingInput() {
        return this.currentLeaveType.leaveType !== Constant.OTHER_LEAVE && this.currentLeaveType.leaveType != Constant.UNPAID_LEAVE;
    }

    leaveHoursLessThanTimeRemaining(timeRemaining) {
        let leaveTime = this.currentLeaveType.leaveType === Constant.COMPENSATORY_LEAVE ? this.leave.leaveHour : this.getLeaveDays();
        if (this.currentLeaveType.leaveType === Constant.UNPAID_LEAVE ||
            this.currentLeaveType.leaveType === Constant.FUNERAL_LEAVE ||
            this.currentLeaveType.leaveType === Constant.WEDDING_LEAVE ||
            this.currentLeaveType.leaveType === Constant.CHILD_WEDDING_LEAVE ||
            this.currentLeaveType.leaveType === Constant.OTHER_LEAVE) {
            return false;
        }
        if (leaveTime == 0) {
            return false
        }
        return Number(leaveTime) > Number(timeRemaining);
    }

    onDateRangePickerChanged() {
        this.setLeaveHours();
        this.leave.leaveFromAt = moment(this.leave.leaveTime.startDate).format(Constant.DATE_TIME_FORMAT);
        this.leave.leaveToAt = moment(this.leave.leaveTime.endDate).format(Constant.DATE_TIME_FORMAT);
    }

    closeModal() {
        this.modalRef.hide();
    }

    setLeaveHours() {
        this.leave.leaveHour = getLeaveTime(this.leave.leaveTime.startDate, this.leave.leaveTime.endDate).hours;
    }

    renderLeaveTime() {
        var distanceHour =getLeaveTime(this.leave.leaveTime.startDate, this.leave.leaveTime.endDate).hours;
        var leaveHours =(Math.round(distanceHour* 100 )/100).toFixed(2);
        return this.currentLeaveType.leaveType === Constant.COMPENSATORY_LEAVE ? leaveHours + ' ' + this.translate.instant("timeManager.totalEmployee.hours") : getLeaveTime(this.leave.leaveTime.startDate, this.leave.leaveTime.endDate).days + ' ' + this.translate.instant("timeManager.totalEmployee.days");
    }

    renderTimeRemaining() {
        return this.currentLeaveType.leaveType === Constant.COMPENSATORY_LEAVE ? this.currentLeaveType.timeRemaining + ' ' + this.translate.instant("present.btn.hours") : this.currentLeaveType.timeRemaining + ' ' + this.translate.instant("present.btn.days");
    }

    getLeaveDays() {
        return getLeaveTime(this.leave.leaveTime.startDate, this.leave.leaveTime.endDate).days
    }

    getDaysByHours() {
        return getDaysByHours(this.leave.leaveHour);
    }

    validateForm() {
        this.updateLeaveForm.markAllAsTouched();
        const invalid = [];
        const controls = this.updateLeaveForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.updateLeaveForm.errors;
    }

    saveLeave() {
        if (this.validateForm() && this.leave.leaveHour > 0 && this.getDaysByHours() > 0) {
            this.leave.employeeId = this.employeeId
            this.leave.sendApproveReq = false;
            let body = newLeaveRequestModel(this.leave);
            this.leaveService.createOnLeave(body).subscribe((res) => {
                if (res.success) {
                    let newLeave = {
                        employeeName: this.user.companyCode + '-' + this.user.fullName,
                        companyEmail: this.user.email,
                        employeeLeave: res.data
                    }
                    this.createLeaveEvent.emit(newLeave);
                    this.toastr.success(this.translate.instant("timeManager.add_onleave_management.sign_up_success"));
                    this.closeModal();
                } else {
                    this.toastr.error(res.message);
                }
            }, error => {
                this.toastr.error(this.translate.instant("timeManager.add_onleave_management.sign_up_fail"))
            })
        }
    }

    onSaveAndApprove() {
        if (this.validateForm() && this.leave.leaveHour > 0 && this.getDaysByHours() > 0) {
            this.leave.sendApproveReq = true;
            let body = newLeaveRequestModel(this.leave);
            this.leaveService.createOnLeave(body).subscribe((res) => {
                if (res.success) {
                    let newLeave = {
                        employeeName: this.user.companyCode + '-' + this.user.fullName,
                        companyEmail: this.user.email,
                        employeeLeave: res.data
                    }
                    this.createLeaveEvent.emit(newLeave);
                    this.toastr.success(this.translate.instant("timeManager.add_onleave_management.Successful_registration_and_submission_of_approval"));
                    this.closeModal();
                } else {
                    this.toastr.error(res.message)
                }
            }, error => {
                this.toastr.error(this.translate.instant("timeManager.add_onleave_management.Successful_registration_and_submission_of_approval"))
            })
        }
    }

    blurLeaveReason() {
        this.updateLeaveForm.controls["reason"].setValue(this.updateLeaveForm.controls["reason"].value.trim())
    }

    hasRole(roleCode) {
        let roles = this.roles.filter(role =>
            role.code === roleCode
        );
        return roles.length > 0;
    }

    canSeeSaveAndSendApproval() {
        return !this.hasRole(ROLE_LIST.C_B)
    }
}
