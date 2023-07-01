import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {PresenceService} from "../../../../../../../../core/services/presence.service";
import {getApprovalRequestModel} from "../../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";

@Component({
    selector: 'app-approval-os',
    templateUrl: './approval-os.component.html',
    styleUrls: ['./approval-os.component.css']
})
export class ApprovalOsComponent implements OnInit {
    selectedPresenceId;
    @Output() approvalEvent = new EventEmitter<any>();

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
        let bodyRequest = getApprovalRequestModel(this.selectedPresenceId);
        this.presenceService.approval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.approvalEvent.emit(res.success);
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
