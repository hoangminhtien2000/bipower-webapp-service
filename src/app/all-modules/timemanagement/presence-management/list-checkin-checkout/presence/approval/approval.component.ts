import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";

@Component({
    selector: 'app-approval',
    templateUrl: './approval.component.html',
    styleUrls: ['./approval.component.scss']
})
export class ApprovalComponent implements OnInit {
    @Output() approvalEvent = new EventEmitter<any>();

    constructor(public modal: BsModalRef) {
    }

    ngOnInit(): void {
    }

    confirm() {
        this.approvalEvent.emit('confirm');
        this.closeModal();
    }

    closeModal() {
        this.modal.hide();
    }
}
