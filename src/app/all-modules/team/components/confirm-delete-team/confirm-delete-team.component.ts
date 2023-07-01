import { Component, OnInit } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {BsModalRef} from "ngx-bootstrap/modal";

declare const $;
@Component({
  selector: 'app-confirm-delete-team',
  templateUrl: './confirm-delete-team.component.html',
  styleUrls: ['./confirm-delete-team.component.css']
})
export class ConfirmDeleteTeamComponent implements OnInit {

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
