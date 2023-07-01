import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {
    getSendApprovalRequestModel
} from "../../../../../core/models/request/LeaveRequestModel";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-send-approval-multil',
    templateUrl: './send-approval-multil.component.html',
    styleUrls: ['./send-approval-multil.component.css']
})
export class SendApprovalMultilComponent implements OnInit {
    selectedLeaveIds;
    @Output() sendMultilApprovalEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
    private translate: TranslateService
) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.sendMultilApprovalLeave();
    }

    closeModal() {
        this.modalRef.hide();
    }

    sendMultilApprovalLeave() {
        let bodyRequest = getSendApprovalRequestModel(this.selectedLeaveIds);
        this.leaveService.sendApproval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.sendMultilApprovalEvent.emit(res);
                let message =this.translate.instant("timeManager.list_onleave.unsubscribe_confirmation_successful");
                this.toastr.success(message, this.translate.instant("timeManager.edit_onleave_management.notification"));
                this.closeModal();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
