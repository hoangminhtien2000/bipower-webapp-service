import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {getApprovalRequestModel} from "../../../../../core/models/request/LeaveRequestModel";

@Component({
    selector: 'app-approval',
    templateUrl: './approval.component.html',
    styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {
    leave;
    @Output() approvalEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
    ) {
    }

    ngOnInit(): void {
    }

    closeModal() {
        this.modalRef.hide();
    }

    confirm() {
        this.approval();
    }

    approval() {
        const body = getApprovalRequestModel([this.leave.id])
        this.leaveService.approval(body).subscribe((res) => {
            if (res.success) {
                this.approvalEvent.emit(res.data);
                this.toastr.success("Phê duyệt thành công");
                this.modalRef.hide();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, "Lỗi");
        })
    }
}
