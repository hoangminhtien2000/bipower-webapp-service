import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {OnleaveManagementService} from "../../../../../core/services/onleave-management.service";
import {ToastrService} from "ngx-toastr";
import {
    getUnSubscribeRequestModel
} from "../../../../../core/models/request/LeaveRequestModel";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Constant} from "../../../../../core/helper/leave/constants";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-unsubscribe',
    templateUrl: './unsubscribe.component.html',
    styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {
    leave: any;
    note: string = "";
    formGroup: FormGroup;
    @Output() unSubscribeEvent = new EventEmitter<any>();

    constructor(
        public modalRef: BsModalRef,
        private leaveService: OnleaveManagementService,
        private toastr: ToastrService,
        private fb: FormBuilder,
        private translate: TranslateService
    ) {
    }

    ngOnInit(): void {
        this.validateForm()
    }

    closeModal() {
        this.modalRef.hide();
    }

    validateForm() {
        this.formGroup = this.fb.group({
            note: [this.note, [Validators.required, Validators.maxLength(Constant.LEAVE_REASON_MAX_LENGTH)]],
        });
        return !this.formGroup.invalid;
    }


    confirm() {
        this.unSubscribe();
    }

    unSubscribe() {
        let body = getUnSubscribeRequestModel([this.leave.id], this.note);
        this.leaveService.sendUnSubscribe(body).subscribe((res) => {
            if (res.success) {
                this.unSubscribeEvent.emit(res.data);
                this.toastr.success(this.translate.instant("timeManager.list_onleave.Submit_unsubscribe_request_successfully"));
                this.modalRef.hide();
            } else {
                this.toastr.error(res.message)
            }
        }, error => {
            this.toastr.error(error.error?.title,  this.translate.instant("timeManager.add_onleave_management.error"));
        })
    }
}
