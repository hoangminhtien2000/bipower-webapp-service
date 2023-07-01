import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Constant} from "../../../../../core/helper/presence/constants";
import {ToastrService} from "ngx-toastr";
import {PresenceService} from "../../../../../core/services/presence.service";
import {rejectPresencesRequestModel} from "../../../../../core/models/request/PresenceRequestModel";

@Component({
    selector: 'app-reject-presence',
    templateUrl: './reject-presence.component.html',
    styleUrls: ['./reject-presence.component.scss']
})
export class RejectPresenceComponent implements OnInit {
    presenceIds;
    reason: string;
    rejectForm: FormGroup;
    @Output() rejectPresencesEvent = new EventEmitter<any>();

    constructor(public modalRef: BsModalRef,
                private presenceService: PresenceService,
                private toastr: ToastrService,
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
            let bodyRequest = rejectPresencesRequestModel(this.presenceIds, this.reason)
            this.presenceService.rejectPresences(bodyRequest).subscribe(res => {
                if (res.success) {
                    this.rejectPresencesEvent.emit(res.success)
                    this.toastr.success('Từ chối phê duyệt thành công')
                    this.closeModal()
                } else {
                    this.toastr.error(res.message)
                }
            }, error => {
                this.toastr.error(error.statusText)
            })
        }
    }

    closeModal() {
        this.modalRef.hide()
    }

}
