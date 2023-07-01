import {Component, EventEmitter, Inject, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import * as moment from "moment";
import { BsModalRef } from 'ngx-bootstrap/modal';
import {TimeManagementService} from "../../../../core/services/time-management.service";

@Component({
    selector: 'app-approve-form',
    templateUrl: './approve-form.component.html',
    styleUrls: ['./approve-form.component.scss']
})
export class ApproveFormComponent implements OnInit {
    form: FormGroup;
    title = "";
    value: any;
    public content = "";
    constructor(
        private fb: FormBuilder,
        public modalRef: BsModalRef,
        private timeManagerment: TimeManagementService) {
    }
    public currentDate = new Date();
    closeModal(){
        this.modalRef.hide();
    }

    @Output() result = new EventEmitter<any>();

    isRequire(fielName: string) {
        return this.form?.controls[fielName].hasValidator(Validators.required);
    }

    ngOnInit(): void {
        
    }

    onSave() {
        this.result.emit(true);
    }
    get viewContent(){
        return this.content ? this.content : "";
    }

}
