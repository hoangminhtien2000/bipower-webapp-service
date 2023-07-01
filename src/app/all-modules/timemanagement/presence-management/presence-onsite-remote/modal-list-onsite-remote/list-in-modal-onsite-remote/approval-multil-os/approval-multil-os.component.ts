import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {PresenceService} from "../../../../../../../core/services/presence.service";
import {getApprovalRequestModel} from "../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";

@Component({
    selector: 'app-approval-multil-os',
    templateUrl: './approval-multil-os.component.html',
    styleUrls: ['./approval-multil-os.component.css']
})
export class ApprovalMultilOsComponent implements OnInit {
    selectedLeaveIds;
    @Output() approvalMultilEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private presenceService: PresenceService,
                private toastr: ToastrService) {
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
        this.presenceService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.approvalMultilEvent.emit(res.success);
                let message = 'Phê duyệt thành công!';
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
