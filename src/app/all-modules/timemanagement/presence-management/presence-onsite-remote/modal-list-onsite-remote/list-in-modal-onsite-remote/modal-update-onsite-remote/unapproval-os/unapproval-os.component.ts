import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {PresenceService} from "../../../../../../../../core/services/presence.service";
import {refuseApprovalRequestModel} from "../../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";
import {Constant} from "../../../../../../../../core/helper/leave/constants";

@Component({
    selector: 'app-unapproval-os',
    templateUrl: './unapproval-os.component.html',
    styleUrls: ['./unapproval-os.component.css']
})
export class UnapprovalOsComponent implements OnInit {
    unApprovalLeaveForm: FormGroup;
    selectedPresenceId;
    note = '';
    @Output() unApprovalEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private presentService: PresenceService,
                private toastr: ToastrService,
                private fb: FormBuilder,) {
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
        let bodyRequest = refuseApprovalRequestModel(this.selectedPresenceId, this.note);
        this.presentService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.unApprovalEvent.emit(res.success);
                let message = 'Từ chối phê duyệt thành công!';
                this.toastr.success(message, 'Thông báo');
                this.closeModal();
            }else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, "Lỗi");
        })
    }
}
