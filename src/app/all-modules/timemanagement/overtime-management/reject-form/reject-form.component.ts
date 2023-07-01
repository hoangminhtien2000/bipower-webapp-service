import {Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {TimeManagementService} from "../../../../core/services/time-management.service";
declare const $: any;

@Component({
    selector: 'app-reject-form',
    templateUrl: './reject-form.component.html',
    styleUrls: ['./reject-form.component.scss']
})
export class RejectFormComponent implements OnInit {
    form: FormGroup;

    value: any;
    constructor(
        private fb: FormBuilder,
        public modalRef: BsModalRef,
        public modalService: BsModalService,
        private timeManagerment: TimeManagementService) {
    }
    public currentDate = new Date();
    closeModal(){
        // this.modalRef.hide();
        // debugger
        // const modalCount = this.modalService.getModalsCount();
        // if (modalCount > 0) {
        // }
        this.modalRef.hide();

    }

    @Output() result = new EventEmitter<any>();

    isRequire(fielName: string) {
        return this.form?.controls[fielName].hasValidator(Validators.required);
    }

    ngOnInit(): void {
        this.form = this.fb.group({
            note: ["", [Validators.required, Validators.maxLength(500)]]
        })
    }

   
    onSave() {
        this.form.markAllAsTouched();
        if(this.form.valid){
            this.result.emit(this.form.value);
        }
    }

    hasRole(role: string) {
        return this.timeManagerment.hasRole(role);
    }

    onBlur() {
        if(this.form.value.note){
            this.form.setValue({
                note: this.form.value.note.trim()
            })
        }
    }

}
