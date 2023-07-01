import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {Constant} from "../../../../../../../core/helper/leave/constants";
import {refuseApprovalRequestModel} from "../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";
import {PresenceService} from "../../../../../../../core/services/presence.service";

@Component({
    selector: 'app-unapproval-multil-os',
    templateUrl: './unapproval-multil-os.component.html',
    styleUrls: ['./unapproval-multil-os.component.css']
})
export class UnapprovalMultilOsComponent implements OnInit {
    unApprovalLeaveForm: FormGroup;
    selectedLeaveIds;
    note = '';
    @Output() unApprovalMultilEvent = new EventEmitter<any>();

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
        let bodyRequest = refuseApprovalRequestModel(this.selectedLeaveIds, this.note);
        this.presentService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.unApprovalMultilEvent.emit(res.success);
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
