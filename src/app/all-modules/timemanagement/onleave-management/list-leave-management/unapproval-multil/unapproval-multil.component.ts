import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {Constant} from "../../../../../core/helper/leave/constants";
import {
    refuseApprovalRequestModel
} from "../../../../../core/models/request/LeaveRequestModel";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-unapproval-multil',
    templateUrl: './unapproval-multil.component.html',
    styleUrls: ['./unapproval-multil.component.css']
})
export class UnapprovalMultilComponent implements OnInit {
    unApprovalLeaveForm: FormGroup;
    selectedLeaveIds;
    note = '';
    @Output() unApprovalMultilEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
                private fb: FormBuilder,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.validateNoApprovalLeaveForm();
    }

    validateNoApprovalLeaveForm() {
        this.unApprovalLeaveForm = this.fb.group({
            note: [this.note, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.unApprovalLeaveForm.invalid;
    }

    confirm() {
        this.unApprovalMultil();
    }

    closeModal() {
        this.modalRef.hide();
    }

    unApprovalMultil() {
        let bodyRequest = refuseApprovalRequestModel(this.selectedLeaveIds, this.note);
        this.leaveService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.unApprovalMultilEvent.emit(res.data);
                let message = this.translate.instant("timeManager.list_onleave.reject_approval_success");
                this.toastr.success(message, this.translate.instant("timeManager.edit_onleave_management.notification"));
                this.closeModal();
            }else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
