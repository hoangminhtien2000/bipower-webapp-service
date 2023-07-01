import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {
    refuseApprovalRequestModel
} from "../../../../../core/models/request/LeaveRequestModel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Constant} from "../../../../../core/helper/leave/constants";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-refuse-unsubscribe',
    templateUrl: './refuse-unsubscribe.component.html',
    styleUrls: ['./refuse-unsubscribe.component.css']
})
export class RefuseUnsubscribeComponent implements OnInit {
    leave: any;
    note: string = "";
    formGroup: FormGroup;
    @Output() refuseUnSubscribeEvent = new EventEmitter<any>();

    constructor(
        public modalRef: BsModalRef,
        private leaveService: OnleaveManagementService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.validateForm()
    }

    validateForm() {
        this.formGroup = this.fb.group({
            note: [this.note, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.formGroup.invalid;
    }

    closeModal() {
        this.modalRef.hide();
    }

    confirm() {
        this.refuseUnSubscribe();
    }

    refuseUnSubscribe() {
        let body = refuseApprovalRequestModel([this.leave.id], this.note);
        this.leaveService.approval(body).subscribe((res) => {
            if (res.success) {
                this.refuseUnSubscribeEvent.emit(res.data);
                this.toastr.success(this.translate.instant("timeManager.list_onleave.unsubscribe_confirmation_successful"));
                this.modalRef.hide();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
