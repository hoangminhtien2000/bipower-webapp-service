import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import {OvertimeManagementService} from "../../../../core/services/overtime-management.service";
import {getLeaveTime} from "../../../../core/helper/leave/calculateLeaveHours";
import {Constant} from "../../../../core/helper/leave/constants";
import {getUnSubscribeRequestModel} from "../../../../core/models/request/LeaveRequestModel";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-unsubscribe-overtime',
    templateUrl: './unsubscribe-overtime.component.html',
    styleUrls: ['./unsubscribe-overtime.component.css']
})
export class UnsubscribeOvertimeComponent implements OnInit {
    leave: any;
    note: string = "";
    formGroup: FormGroup;
    @Output() unSubscribeEvent = new EventEmitter<any>();
    today = moment()

    constructor(
        public modalRef: BsModalRef,
        private leaveService: OvertimeManagementService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService,

    ) {
    }

    ngOnInit(): void {
        this.validateForm()
    }
    onDateRangePickerChanged() {
        this.setLeaveHours();
        this.leave.leaveFromAt = moment(this.leave.leaveTime.startDate).format(Constant.DATE_TIME_FORMAT);
        this.leave.leaveToAt = moment(this.leave.leaveTime.endDate).format(Constant.DATE_TIME_FORMAT);
    }
    setLeaveHours() {
        this.leave.leaveHour = getLeaveTime(this.leave.leaveTime.startDate, this.leave.leaveTime.endDate).hours;
    }
    closeModal() {
        this.modalRef.hide();
    }

    validateForm() {
        this.formGroup = this.fb.group({
            note: [this.note, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.formGroup.invalid;
    }


    confirm() {
        this.unSubscribe();
    }

    unSubscribe() {
        let body = getUnSubscribeRequestModel([this.leave.id], this.note);
        this.leaveService.sendUnSubscribe(body).subscribe((res) => {
            if (res.success) {
                this.unSubscribeEvent.emit(res.data);
                this.toastr.success("Gửi yêu cầu huỷ đăng ký thành công!");
                this.modalRef.hide();
            } else {
                this.toastr.error(res.message)
            }
        }, error => {
            this.toastr.error(error.error?.title, "Lỗi");
        })
    }
}
