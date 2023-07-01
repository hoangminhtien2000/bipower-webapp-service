import {Component, Input, OnInit, Output} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BsModalRef} from "ngx-bootstrap/modal";

declare const $;
@Component({
  selector: 'app-confirm-save-dialog',
  templateUrl: './confirm-save-dialog.component.html',
  styleUrls: ['./confirm-save-dialog.component.css']
})
export class ConfirmSaveDialogComponent implements OnInit {

  confirmSubject$ = new BehaviorSubject<boolean>(null);

  constructor(private modalRef: BsModalRef) {
  }

  ngOnInit(): void {
  }

  closeConfirm(confirm: boolean): void {
    this.confirmSubject$.next(confirm);
    this.modalRef.hide();
  }

}
