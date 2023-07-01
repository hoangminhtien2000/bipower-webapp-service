import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder} from "@angular/forms";
import {PresenceService} from "../../../../../core/services/presence.service";
import {ToastrService} from "ngx-toastr";
import {
    approvalPresencesRequestModel, rejectPresencesRequestModel,
} from "../../../../../core/models/request/PresenceRequestModel";
import {hasRoles} from "../../../../../core/helper/role";
import {ROLE_LIST} from "../../../../../core/common/constant";
import {ApprovalComponent} from "./approval/approval.component";
import {RejectComponent} from "./reject/reject.component";
import {Constant} from "../../../../../core/helper/presence/constants";
import {getTimeString} from "../../../../../core/helper/presence/common";
import * as moment from 'moment';

@Component({
    selector: 'app-presence',
    templateUrl: './presence.component.html',
    styleUrls: ['./presence.component.scss']
})
export class PresenceComponent implements OnInit {
    presence;
    checkinTime: string;
    checkoutTime: string;
    reason: string;
    @Output() approvalPresenceEvent = new EventEmitter<any>();
    @Output() rejectPresenceEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                public approvalModal: BsModalRef,
                public rejectModal: BsModalRef,
                private fb: FormBuilder,
                public modalService: BsModalService,
                private presenceService: PresenceService, public toastrService: ToastrService) {
    }

    ngOnInit(): void {
        this.setCheckinTime(getTimeString(this.presence.checkinTimeEdit));
        this.setCheckoutTime(getTimeString(this.presence.checkoutTimeEdit));
        this.setReason(this.presence.reason);
        this.renderDay();
    }

    renderDay() {
        return moment(this.presence.checkoutTimeEdit, Constant.DATE_TIME_FORMAT).format(Constant.DATE_FORMAT);
    }

    setCheckinTime(checkinTime) {
        this.checkinTime = this.presenceService.getCheckinTime(checkinTime);
    }

    setCheckoutTime(checkoutTime) {
        this.checkoutTime = this.presenceService.getCheckoutTime(checkoutTime);
    }

    setReason(reason) {
        this.reason = reason ? reason : '';
    }

    openApprovalModal() {
        this.approvalModal = this.modalService.show(ApprovalComponent, {
            initialState: {
            },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false,
        });
    }

    openRejectModal() {
        this.rejectModal = this.modalService.show(RejectComponent, {
            initialState: {},
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false,
        });
    }

    approval() {
        this.closeModal();
        this.openApprovalModal();
        this.approvalModal.content.approvalEvent.subscribe(res => {
            if (res) {
                let bodyRequest = approvalPresencesRequestModel([this.presence.id]);
                this.presenceService.approvalPresences(bodyRequest).subscribe(res => {
                    if (res.success) {
                        this.approvalPresenceEvent.emit(res.success);
                        this.toastrService.success('Xác nhận phê duyệt thành công')
                        this.closeModal();
                    } else {
                        this.toastrService.error(res.message)
                    }
                }, error => {
                    this.toastrService.error(error.statusText)
                })
            }
        })
    }

    reject() {
        this.closeModal();
        this.openRejectModal();
        this.rejectModal.content.rejectEvent.subscribe(res => {
            if (res) {
                let bodyRequest = rejectPresencesRequestModel([this.presence.id], res.reason);
                this.presenceService.rejectPresences(bodyRequest).subscribe(res => {
                    if (res.success) {
                        this.rejectPresenceEvent.emit(res.success);
                        let message = "Từ chối phê duyệt thành công";
                        this.toastrService.success(message);
                        this.closeModal();
                    } else {
                        this.toastrService.error(res.message);
                    }
                }, error => {
                    this.toastrService.error(error.statusText);
                })
            }
        })
    }

    canApprovalOrReject() {
        if (hasRoles(ROLE_LIST.C_B)) {
            return this.presence.status === Constant.PRESENCE_STATUS.LEADER_APPROVED;
        }
        if (hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER)) {
            return this.presence.status === Constant.PRESENCE_STATUS.SENT_REQUEST;
        }
    }

    closeModal() {
        this.modalRef.hide();
    }
}
