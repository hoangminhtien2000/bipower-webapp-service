import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {
    getApprovalRequestModel
} from "../../../../../core/models/request/LeaveRequestModel";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-approval-multil',
    templateUrl: './approval-multil.component.html',
    styleUrls: ['./approval-multil.component.css']
})
export class ApprovalMultilComponent implements OnInit {
    selectedLeaveIds;
    @Output() approvalMultilEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.approvalMultilLeave();
    }

    closeModal() {
        this.modalRef.hide();
    }

    approvalMultilLeave() {
        let bodyRequest = getApprovalRequestModel(this.selectedLeaveIds);
        this.leaveService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.approvalMultilEvent.emit(res.data);
                let message = this.translate.instant("timeManager.list_onleave.approval_success");
                this.toastr.success(message, this.translate.instant("timeManager.list_onleave.notification"));
                this.closeModal();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
