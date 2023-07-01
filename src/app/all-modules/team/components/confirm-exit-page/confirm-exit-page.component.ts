import {Component, OnInit} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BsModalRef} from "ngx-bootstrap/modal";

declare const $;
@Component({
    selector: 'app-confirm-exit-page',
    templateUrl: './confirm-exit-page.component.html',
    styleUrls: ['./confirm-exit-page.component.css']
})
export class ConfirmExitPageComponent implements OnInit {

    confirmSubject$ = new BehaviorSubject<boolean>(null);

    constructor(private modalRef: BsModalRef) {
    }

    ngOnInit(): void {
    }

    closeConfirm(confirm: boolean): void {
        this.confirmSubject$.next(confirm);
        this.modalRef?.hide();
    }

}
