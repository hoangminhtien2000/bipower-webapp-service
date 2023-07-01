import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {ToastrService} from "ngx-toastr";
import {PresenceService} from "../../../../../../../../core/services/presence.service";
import {getSendApprovalRequestModel} from "../../../../../../../../core/models/request/PresenceOnsiteRemoteRequestModel";

@Component({
    selector: 'app-send-approval-os',
    templateUrl: './send-approval-os.component.html',
    styleUrls: ['./send-approval-os.component.css']
})
export class SendApprovalOsComponent implements OnInit {
    selectedLeaveIds;
    @Output() sendApprovalEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private presenceService: PresenceService,
                private toastr: ToastrService) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.sendApprovalLeave();
    }

    closeModal() {
        this.modalRef.hide();
    }

    sendApprovalLeave() {
        let bodyRequest = getSendApprovalRequestModel(this.selectedLeaveIds);
        this.presenceService.sendApproval(bodyRequest).subscribe(res => {
            if (res.success) {
                this.sendApprovalEvent.emit(res.success);
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
