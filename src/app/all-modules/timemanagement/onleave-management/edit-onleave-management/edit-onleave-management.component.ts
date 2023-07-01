import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap/modal';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import {OnleaveManagementService} from "../../../../core/services/onleave-management.service";
import {
    startDateLessThanEndDate,
    startLessThanStartWorkingDay,
    endBiggerThanEndWorkingDay, noLunchTime, noWorkingDays, noLeave, timeRegisteredLessThanTimeRemaining
} from "../../../../core/helper/leave/validateUpdateLeaveForm";
import {Constant} from "../../../../core/helper/leave/constants";
import {getLeaveTime, getTimeRemainingByLeaveType} from "../../../../core/helper/leave/calculateLeaveHours";
import {
    leaveUpdateRequestModel
} from "../../../../core/models/request/LeaveRequestModel"
import {ToastrService} from "ngx-toastr";
import {ROLE_LIST} from "../../../../core/common/constant";
import {UserStorage} from "../../../../core/storage/user.storage";
import {hasRoles} from "../../../../core/helper/role";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-edit-onleave-management',
    templateUrl: './edit-onleave-management.component.html',
    styleUrls: ['./edit-onleave-management.component.css']
})
export class EditOnleaveManagementComponent implements OnInit {
    leave;
    leaveTypes = OnleaveManagementService.leaveTypes;
    onLeaveLeaveType = OnleaveManagementService.valueLeaveType;
    updateLeaveForm: FormGroup;
    timeRegistered;
    leaveType;
    timeRangepicker;
    timeRemaining;
    reason;
    user: any = this.userStorage.getUserInfo();
    roles = this.userStorage.getUserRoles();
    @Output() updateLeaveEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                public options: ModalOptions,
                private fb: FormBuilder,
                public modalService: BsModalService,
                private userStorage: UserStorage,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
                private translate: TranslateService
    ) {
    }

    ngOnInit() {
        this.setLeaveType(this.leave.leaveType)
        this.setTimeRangepicker(this.leave.leaveFromAt, this.leave.leaveToAt);
        this.selectLeaveType(this.leave.leaveType);
        this.setTimeRemaining(Constant.INIT_TIME_REMAINING);
        this.validateUpdateLeaveForm();
        this.setTimeRegistered(this.leave.leaveType, this.leave.leaveFromAt, this.leave.leaveToAt);
        this.setReason(this.leave.reason);
        this.fetchLeaveDetail();
    }

    fetchLeaveDetail() {
        this.leaveService.getLeaveDetail(this.leave.id).subscribe(res => {
            if (res.success) {
                res.data.confirmedBy ? this.leave.confirmedBy = res.data.confirmedBy : null;
                res.data.rejectedReason ? this.leave.rejectedReason = res.data.rejectedReason : null;
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"))
        })
    }

    setTimeRangepicker(startDate, endDate) {
        this.timeRangepicker = {startDate: startDate, endDate: endDate}
    }

    setTimeRemaining(timeRemaining) {
        this.timeRemaining = timeRemaining;
    }

    setLeaveType(leaveType) {
        this.leaveType = leaveType;
    }

    setReason(reason) {
        this.reason = reason;
    }

    onDateRangePickerChanged(event) {
        this.setTimeRangepicker(event.startDate, event.endDate);
        this.setTimeRegistered(this.leaveType, event.startDate, event.endDate);
    }

    selectLeaveType(selectedLeaveType) {
        this.fetchLeaveType(selectedLeaveType, this.translate);
    }

    fetchLeaveType(selectedLeaveType, translate) {
        this.leaveService.getTotalTimeToBox().subscribe(res => {
            if (res.success) {
                this.setLeaveType(selectedLeaveType);
                this.setTimeRemaining(getTimeRemainingByLeaveType(selectedLeaveType, res.data))
                this.setTimeRegistered(this.leaveType, this.timeRangepicker.startDate, this.timeRangepicker.endDate)
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }

    validateUpdateLeaveForm() {
        this.updateLeaveForm = this.fb.group({
            leaveType: [this.leaveType, [Validators.required]],
            timeRegistered: [this.timeRegistered, [noLeave()]],
            timeRemaining: [this.timeRemaining, [Validators.required]],
            timeRangepicker: [this.timeRangepicker, [Validators.required, startDateLessThanEndDate(), startLessThanStartWorkingDay(), endBiggerThanEndWorkingDay(), noLunchTime(), noWorkingDays()]],
            reason: [this.reason, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.updateLeaveForm.invalid;
    }

    timeRegisteredIsNotValid() {
        return timeRegisteredLessThanTimeRemaining(this.leaveType, this.timeRemaining, this.timeRegistered);
    }

    saveLeave() {
        this.updateLeave(Constant.SAVE)
    }

    saveAndSendLeave() {
        this.updateLeave(Constant.SAVE_AND_SEND)
    }

    updateLeave(actionType) {
        let bodyRequest = leaveUpdateRequestModel(this.timeRangepicker, this.leaveType, this.reason, actionType);
        this.leaveService.updateLeave(this.leave.id, bodyRequest).subscribe(res => {
            if (res.success) {
                this.updateLeaveEvent.emit(res.data);
                let message = actionType === Constant.SAVE ? this.translate.instant("timeManager.edit_onleave_management.update_success") : this.translate.instant("timeManager.edit_onleave_management.update_and_submit_approval_successfully");
                this.toastr.success(message, this.translate.instant("timeManager.edit_onleave_management.notification"));
                this.closeModal();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"))
        })
    }

    setTimeRegistered(selectedLeaveType, startDate, endDate) {
        if (selectedLeaveType === Constant.COMPENSATORY_LEAVE) {
            this.timeRegistered = getLeaveTime(startDate, endDate).hours + this.translate.instant("timeManager.totalEmployee.hours");
        } else {
            this.timeRegistered = getLeaveTime(startDate, endDate).days + this.translate.instant("timeManager.totalEmployee.days");
        }
    }

    closeModal() {
        this.modalRef.hide();
    }

    blurLeaveReason() {
        this.updateLeaveForm.controls["reason"].setValue(this.updateLeaveForm.controls["reason"].value.trim())
    }

    canEditLeave(leave) {
        if (leave) {
            return this.userStorage.isMyRecord(leave.companyEmail) && (leave.leaveStatus === Constant.PENDING || leave.leaveStatus === Constant.REJECTED);
        }
    }

    canSeeSaveAndSendApproval(leave) {
        if (hasRoles(ROLE_LIST.C_B)) {
            return false;
        } else {
            return this.canEditLeave(leave);
        }
    }

    showTimeRemainingInput() {
        return this.leaveType !== Constant.OTHER_LEAVE && this.leaveType != Constant.UNPAID_LEAVE;
    }
}
