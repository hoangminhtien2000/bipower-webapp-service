import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Constant} from "../../../../../core/helper/presence/constants";
import {checkinTimeBiggerThanCheckoutTime} from "../../../../../core/helper/presence/customValidate/updatePresenceForm";
import {PresenceService} from "../../../../../core/services/presence.service";
import {ToastrService} from "ngx-toastr";
import {
    addPresenceRequestModel,
    updatePresenceRequestModel
} from "../../../../../core/models/request/PresenceRequestModel";
import {getTimeToFormat} from "../../../../../core/helper/presence/fullCalendar";
import {Presence} from "../../../../../core/models/presence.model";
import {hasRoles} from "../../../../../core/helper/role";
import {ROLE_LIST} from "../../../../../core/common/constant";
import {setStatusOfPresence} from "../../../../../core/helper/presence/common";
import * as moment from "moment/moment";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-update-presence',
    templateUrl: './update-presence.component.html',
    styleUrls: ['./update-presence.component.scss']
})
export class UpdatePresenceComponent implements OnInit {
    presence: Presence;
    checkinTime: string;
    checkoutTime: string;
    reason: string;
    updatePresenceForm: FormGroup;
    @Output() updatePresenceEvent = new EventEmitter<any>();
    @Output() addPresenceEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private fb: FormBuilder,
                private presenceService: PresenceService, 
                public toastrService: ToastrService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.setCheckinTime(this.setTime(this.presence.checkinTimeEdit, this.presence.checkinTime));
        this.setCheckoutTime(this.setTime(this.presence.checkoutTimeEdit, this.presence.checkoutTime));
        this.setReason(this.presence.reason);
        this.initValidateUpdatePresenceForm();
        this.fetchPresence();
    }

    renderStartDay() {
        return moment(this.presence.start, Constant.DATE_FORMAT).format(Constant.DATE_FORMAT);
    }

    setCheckinTime(checkinTime) {
        this.checkinTime = this.presenceService.getCheckinTime(checkinTime);
    }

    setCheckoutTime(checkoutTime) {
        this.checkoutTime = this.presenceService.getCheckoutTime(checkoutTime);
    }

    setReason(reason) {
        this.reason = reason ? reason : '';
    }

    setTime(checkinTimeEdit, checkinTime) {
        return checkinTimeEdit !== undefined ? checkinTimeEdit : checkinTime;
    }

    fetchPresence() {
        if (this.presence.workTimeId) {
            this.presenceService.getPresence(this.presence.workTimeId).subscribe(res => {
                if (res.success) {
                    let presence = setStatusOfPresence(res.data);
                    let checkinTime = this.setTime(presence.checkinTimeEdit, presence.checkinTime);
                    let checkoutTime = this.setTime(presence.checkoutTimeEdit, presence.checkoutTime);
                    this.setCheckinTime(getTimeToFormat(checkinTime));
                    this.setCheckoutTime(getTimeToFormat(checkoutTime));
                } else {
                    this.toastrService.error(res.message)
                }
            }, error => {
                this.toastrService.error(error.statusText)
            })
        }
    }

    initValidateUpdatePresenceForm() {
        this.updatePresenceForm = this.fb.group({
            checkinTime: [this.checkinTime, [Validators.required]],
            checkoutTime: [this.checkoutTime, [Validators.required]],
            reason: [this.reason, [Validators.required, Validators.maxLength(Constant.PRESENCE_REASON_MAX_LENGTH)]],
        });
        return !this.updatePresenceForm.invalid;
    }

    validateUpdatePresenceForm() {
        this.updatePresenceForm.markAllAsTouched();
        const invalid = [];
        let controls = this.updatePresenceForm.controls;

        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.updatePresenceForm.errors;
    }

    checkinTimeBiggerThanCheckoutTime() {
        return checkinTimeBiggerThanCheckoutTime(this.checkinTime, this.checkoutTime);
    }

    blurReason() {
        this.updatePresenceForm.controls["reason"].setValue(this.updatePresenceForm.controls["reason"].value ? this.updatePresenceForm.controls["reason"].value.trim() : "")
    }

    canSendApprovalPresence() {
        return !hasRoles(ROLE_LIST.C_B);
    }

    sendApprovalPresence() {
        if (this.presence.workTimeId != undefined) {
            this.updatePresence(true);
        } else {
            this.addPresence(true);
        }
    }

    savePresence() {
        if (this.presence.workTimeId != undefined) {
            this.updatePresence(false);
        } else {
            this.addPresence(false);
        }
    }

    updatePresence(sendApproveReq) {
        if (this.validateUpdatePresenceForm() && !this.checkinTimeBiggerThanCheckoutTime()) {
            let body = updatePresenceRequestModel(this.presence.workTimeId, this.presence.start, this.checkinTime, this.checkoutTime, this.reason, sendApproveReq);
            this.presenceService.updatePresence(body).subscribe(res => {
                if (res.success) {
                    this.updatePresenceEvent.emit(res.success);
                    let message = sendApproveReq ? "Gửi phê duyệt thành công." : "Cập nhật thông tin thành công.";
                    this.toastrService.success(message);
                    this.closeModal();
                } else {
                    this.toastrService.error(res.message);
                }
            }, error => {
                this.toastrService.error(error.error?.message);
            })
        }
    }

    addPresence(sendApproveReq) {
        if (this.validateUpdatePresenceForm() && !this.checkinTimeBiggerThanCheckoutTime()) {
            let body = addPresenceRequestModel(this.presence.start, this.checkinTime, this.checkoutTime, this.reason, sendApproveReq);
            this.presenceService.addPresence(body).subscribe(res => {
                if (res.success) {
                    this.addPresenceEvent.emit(res.success);
                    let message = sendApproveReq ? "Gửi phê duyệt thành công." : "Cập nhật thông tin thành công.";
                    this.toastrService.success(message);
                    this.closeModal();
                } else {
                    this.toastrService.error(res.message);
                }
            }, error => {
                this.toastrService.error(error.error?.message);
            })
        }
    }

    closeModal() {
        this.modalRef.hide();
    }
}
