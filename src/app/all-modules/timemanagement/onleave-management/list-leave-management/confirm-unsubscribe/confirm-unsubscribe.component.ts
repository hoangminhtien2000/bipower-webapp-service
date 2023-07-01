import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {getApprovalRequestModel} from "../../../../../core/models/request/LeaveRequestModel";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-confirm-unsubscribe',
    templateUrl: './confirm-unsubscribe.component.html',
    styleUrls: ['./confirm-unsubscribe.component.css']
})
export class ConfirmUnsubscribeComponent implements OnInit {
    leave;
    @Output() confirmUnSubscribeEvent = new EventEmitter<any>();


    constructor(public modalRef: BsModalRef,
                private leaveService: OnleaveManagementService,
                private toastr: ToastrService,
                private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
    }

    closeModal() {
        this.modalRef.hide();
    }

    confirm() {
        this.confirmUnSubscribe();
    }

    confirmUnSubscribe() {
        const body = getApprovalRequestModel([this.leave.id])
        this.leaveService.approval(body).subscribe((res) => {
            if (res.success) {
                this.confirmUnSubscribeEvent.emit(res.data);
                this.toastr.success(this.translate.instant("timeManager.list_onleave.unsubscribe_confirmation_successful"));
                this.modalRef.hide();
            } else {
                this.toastr.error(res.message);
            }
        }, error => {
            this.toastr.error(error.error?.title, this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
