import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {PresenceService} from "../../../../../core/services/presence.service";
import {ToastrService} from "ngx-toastr";
import {approvalPresencesRequestModel} from "../../../../../core/models/request/PresenceRequestModel";

@Component({
    selector: 'app-approval-presence',
    templateUrl: './approval-presence.component.html',
    styleUrls: ['./approval-presence.component.scss']
})
export class ApprovalPresenceComponent implements OnInit {
    presenceIds;
    @Output() approvalPresencesEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef, private presenceService: PresenceService, public toastrService: ToastrService) {
    }

    ngOnInit(): void {
    }

    confirm() {
        let bodyRequest = approvalPresencesRequestModel(this.presenceIds);
        this.presenceService.approvalPresences(bodyRequest).subscribe(res => {
            if (res.success) {
                this.approvalPresencesEvent.emit(res.data);
                this.toastrService.success('Xác nhận phê duyệt thành công')
                this.closeModal();
            } else {
                this.toastrService.error(res.message)
            }
        }, error => {
            this.toastrService.error(error.statusText)
        })
    }

    closeModal() {
        this.modalRef.hide();
    }
}
