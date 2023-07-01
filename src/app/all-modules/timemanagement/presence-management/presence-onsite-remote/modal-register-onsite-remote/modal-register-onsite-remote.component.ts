import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef, BsModalService, ModalOptions} from "ngx-bootstrap/modal";
import * as moment from "moment";
import {ToastrService} from "ngx-toastr";
import jwt_decode from "jwt-decode";
import {userToken} from "../../../../../core/interfaces/userToken";
import {Constant} from "../../../../../core/helper/presence/constants";
import {ROLE_LIST} from "../../../../../core/common/constant";
import {startDateLessThanEndDate} from "../../../../../core/helper/presence/validateUpdateOnsiteRemoteForm";
import {PresenceService} from "../../../../../core/services/presence.service";
import {
    createOrUpdateOnsiteRemoteRequestModel,
    initOnsiteRemote
} from "../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";
import {
    endBiggerThanEndWorkingDay, noLunchTime,
    startLessThanStartWorkingDay
} from "../../../../../core/helper/leave/validateUpdateLeaveForm";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'modal-register-onsite-remote',
    templateUrl: './modal-register-onsite-remote.component.html',
    styleUrls: ['./modal-register-onsite-remote.component.scss']
})
export class    ModalRegisterOnsiteRemoteComponent implements OnInit {
    public workTypesOnsiteRemote = PresenceService.workTypesOnsiteRemote;
    registerOnsiteRemotePresentForm: FormGroup;
    currentworkingType;
    workType: null;
    public isHidden = false;
    public PROJECTNAME = 'projectName'
    public WORKINGLOCATION = 'workingLocation'
    public REASON = 'reason'
    onsiteRemote = initOnsiteRemote();
    user: userToken = jwt_decode(localStorage.getItem('access_token'));
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    @Output() createOnsiteRemoteEvent = new EventEmitter<any>();
    today = moment()
    maxDate = moment().endOf("month")

    constructor(public modalRef: BsModalRef,
                public options: ModalOptions,
                private toastr: ToastrService,
                private fb: FormBuilder,
                public modalService: BsModalService,
                private presenceService: PresenceService,
                private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.onsiteRemote.workType = 'ONSITE'
        this.setCurrentworkingType(Constant.INIT_TIME_REMAINING, this.onsiteRemote.workType);
        this.validateregisterOnsiteRemotePresentForm();
    }

    setCurrentworkingType(timeRemaining, selectedworkingType) {
        this.currentworkingType = {timeRemaining: timeRemaining, workingType: selectedworkingType}
    }

    validateregisterOnsiteRemotePresentForm() {
        this.registerOnsiteRemotePresentForm = this.fb.group({
            workType: [this.onsiteRemote.workType, [Validators.required]],
            timeRemaining: [this.currentworkingType.timeRemaining, [Validators.required]],
            timeRegister: [this.onsiteRemote.timeRegister, [Validators.required, startLessThanStartWorkingDay(), startDateLessThanEndDate(), startLessThanStartWorkingDay(), endBiggerThanEndWorkingDay(), noLunchTime()]],
            workingLocation: [this.onsiteRemote.workingLocation, [Validators.required, Validators.maxLength(Constant.PH_ADDRESS_MAX_LENGTH)]],
            projectName: [this.onsiteRemote.projectName, [Validators.required, Validators.maxLength(Constant.PH_PROJECT_MAX_LENGTH)]],
            reason: [this.onsiteRemote.reason, [Validators.required, Validators.maxLength(Constant.PH_PROJECT_MAX_LENGTH)]],
        });
        return !this.registerOnsiteRemotePresentForm.invalid;
    }

    onDateRangePickerChanged() {
        this.onsiteRemote.fromTime = moment(this.onsiteRemote.timeRegister.startDate).format(Constant.DATE_TIME_FORMAT);
        this.onsiteRemote.toTime = moment(this.onsiteRemote.timeRegister.endDate).format(Constant.DATE_TIME_FORMAT);
    }

    closeModal() {
        this.modalRef.hide();
    }

    onChangeWorkType() {
        this.currentworkingType.workingType = this.onsiteRemote.workType
    }

    validateForm() {
        this.registerOnsiteRemotePresentForm.markAllAsTouched();
        const invalid = [];
        let controls = this.registerOnsiteRemotePresentForm.controls;

        for (const name in controls) {
            if (this.onsiteRemote.workType == "REMOTE" && (name == this.PROJECTNAME || name == this.WORKINGLOCATION)) continue
            if (this.onsiteRemote.workType == "ONSITE" && name == this.REASON) continue
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.registerOnsiteRemotePresentForm.errors;
    }

    saveOnsiteRemote() {
        if (this.validateForm()) {
            this.onsiteRemote.sendApproveReq = false;
            let body = createOrUpdateOnsiteRemoteRequestModel(this.onsiteRemote);
            this.presenceService.createOnsiteRemote(body).subscribe((res) => {
                if (res.success) {
                    this.toastr.success("common.message.create_new_successfully");
                    this.closeModal();
                } else {
                    this.toastr.error(res.message);
                }
            }, error => {
                this.toastr.error(error.error?.message)
            })
        }
    }

    onSaveAndApprove() {
        if (this.validateForm()) {
            this.onsiteRemote.sendApproveReq = true;
            let body = createOrUpdateOnsiteRemoteRequestModel(this.onsiteRemote);
            this.presenceService.createOnsiteRemote(body).subscribe((res) => {
                if (res.success) {
                    this.toastr.success("Lưu và Gửi phê duyệt thành công");
                    this.closeModal();
                } else {
                    this.toastr.error(res.message)
                }
            }, error => {
                this.toastr.error('Lưu và Gửi phê duyệt thất bại')
            })
        }
    }

    blurAddress() {
        this.registerOnsiteRemotePresentForm.controls["workingLocation"].setValue(this.registerOnsiteRemotePresentForm.controls["workingLocation"].value?.trim())
    }

    blurProject() {
        this.registerOnsiteRemotePresentForm.controls["projectName"].setValue(this.registerOnsiteRemotePresentForm.controls["projectName"].value?.trim())
    }

    blurReason() {
        this.registerOnsiteRemotePresentForm.controls["reason"].setValue(this.registerOnsiteRemotePresentForm.controls["reason"].value?.trim())
    }

    hasRole(roleCode) {
        let roles = this.roles.filter(role =>
            role.code === roleCode
        );
        return roles.length > 0;
    }

    canSeeSaveAndSendApproval() {
        if (this.hasRole(ROLE_LIST.COO)) {
            this.isHidden = true;
        }

        return !this.hasRole(ROLE_LIST.COO)
    }

    canShowAddressProject() {
        if (this.currentworkingType.workingType == "ONSITE") return true;
        return false;
    }

    canShowReason() {
        if (this.currentworkingType.workingType == "REMOTE") return true;
        return false;
    }

    getClassOS() {
        if (this.onsiteRemote.workType == "REMOTE") return 'popUpTable-modify'
        return '';
    }
}
