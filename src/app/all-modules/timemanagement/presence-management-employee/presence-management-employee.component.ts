import {Component, Input, OnInit} from '@angular/core';
import {
    ModalRegisterOnsiteRemoteComponent
} from "../presence-management/presence-onsite-remote/modal-register-onsite-remote/modal-register-onsite-remote.component";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {
    ModalListOnsiteRemoteComponent
} from "../presence-management/presence-onsite-remote/modal-list-onsite-remote/modal-list-onsite-remote.component";

@Component({
    selector: 'app-presence-management-employee',
    templateUrl: './presence-management-employee.component.html',
    styleUrls: ['./presence-management-employee.component.scss'],
})
export class PresenceManagementEmployeeComponent implements OnInit {
    public modalRef: BsModalRef;
    workingStatus
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    isCheckinEvent: boolean = false;
    numberCheckoutEvent: number;

    constructor(public modalService: BsModalService,) {
    }

    ngOnInit(): void {
    }

    checkinEvent(event) {
        if (event) {
            this.isCheckinEvent = event;
        }
    }

    checkoutEvent(event) {
        if (event) {
            this.numberCheckoutEvent = event;
        }
    }

    showModalRegisterOnsiteRemote() {
        this.modalRef = this.modalService.show(ModalRegisterOnsiteRemoteComponent, {
            initialState: {},
            class: 'modal-left modal-dialog-centered w-45 max-width-modal expand',
            ignoreBackdropClick: true
        });
    }

    showModalListOnsiteRemote() {
        this.modalRef = this.modalService.show(ModalListOnsiteRemoteComponent, {
            initialState: {},
            class: 'modal-left modal-dialog-centered w-70 max-width-modal expand',
            ignoreBackdropClick: true
        });
    }

    reciveInformation($event) {
        this.workingStatus = $event
    }
}
