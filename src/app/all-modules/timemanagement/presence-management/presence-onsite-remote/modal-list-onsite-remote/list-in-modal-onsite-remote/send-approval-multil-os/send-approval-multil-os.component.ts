import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {OnleaveManagementService} from "../../../../../../../core/services/onleave-management.service";
import {PresenceService} from "../../../../../../../core/services/presence.service";
import {getSendApprovalRequestModel} from "../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";

@Component({
    selector: 'app-send-approval-multil-os',
    templateUrl: './send-approval-multil-os.component.html',
    styleUrls: ['./send-approval-multil-os.component.css']
})
export class SendApprovalMultilOsComponent implements OnInit {
    selectedLeaveIds;
    @Output() sendMultilApprovalEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private presenceService: PresenceService,
                private toastr: ToastrService) {
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
        this.presenceService.sendApproval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.sendMultilApprovalEvent.emit(res.success);
                let message = 'Gửi phê duyệt thành công!';
                this.toastr.success(message, 'Thông báo');
                this.closeModal();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, "Lỗi");
        })
    }
}
