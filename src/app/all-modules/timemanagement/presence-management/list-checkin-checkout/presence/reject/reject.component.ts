import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Constant} from "../../../../../../core/helper/presence/constants";

@Component({
    selector: 'app-reject',
    templateUrl: './reject.component.html',
    styleUrls: ['./reject.component.scss']
})
export class RejectComponent implements OnInit {
    reason: string;
    rejectForm: FormGroup;
    @Output() rejectEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private fb: FormBuilder,) {
    }

    ngOnInit(): void {
        this.initValidateRejectForm();
    }

    initValidateRejectForm() {
        this.rejectForm = this.fb.group({
            reason: [this.reason, [Validators.required, Validators.maxLength(Constant.PRESENCE_REASON_MAX_LENGTH)]],
        });
        return !this.rejectForm.invalid;
    }

    validateRejectForm() {
        this.rejectForm.markAllAsTouched();
        const invalid = [];
        let controls = this.rejectForm.controls;

        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid.length == 0 && !this.rejectForm.errors;
    }

    blurLeaveReason() {
        this.rejectForm.controls["reason"].setValue(this.rejectForm.controls["reason"].value ? this.rejectForm.controls["reason"].value.trim() : '')
    }

    confirm() {
        if (this.validateRejectForm()) {
            this.rejectEvent.emit({reason: this.reason})
            this.closeModal()
        }
    }

    closeModal() {
        this.modalRef.hide()
    }
}
