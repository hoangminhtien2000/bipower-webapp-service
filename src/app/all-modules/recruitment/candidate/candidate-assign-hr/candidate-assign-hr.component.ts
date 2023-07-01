import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {DatePipe} from "@angular/common";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {CandidateService, UserModel, UserService} from "src/app/core";
import {CandidateAssignModel} from "src/app/core/models/candidate.assign.model";
import {NotifyType} from "src/app/core/common/notify-type";
import {CommonDialogComponent} from "src/app/sharing/common-dialog/common-dialog.component";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
    selector: 'app-candidate-assign-hr',
    templateUrl: './candidate-assign-hr.component.html',
    styleUrls: ['./candidate-assign-hr.component.scss']
})
export class CandidateAssignHrComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private datePipe: DatePipe,
        private translate: TranslateService,
        public catalogItemService: CatalogItemService,
        public candidateService: CandidateService,
        public toastrMessage: ToastrMessageService,
        public userService: UserService
    ) {
    }

    catalogItemContact: CatalogItemModel[] = [];
    userHRs: UserModel[] = [];
    numberHR: number = 2;
    assignHR: string = '';
    candidateIds: number[];
    @Output() assignHRSuccess = new EventEmitter<boolean>();
    @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;

    assignHRModel: any = {};

    ngOnInit() {
        this.onInitCandidateInChargeUser();
    }

    cancelAssignHR() {
        this.bsModalRef.hide();
    }

    saveAssignHR() {
        this.assignHRForm.markAllAsTouched();
        if (this.assignHRForm.invalid) {
            return;
        }

        this.confirmDialog.openModal(null, null, {
            title: 'candidate.confirm.assign_hr.title',
            type: NotifyType.warn,
            btnConfirm: 'candidate.btn.confirm',
            message: this.translate.instant('candidate.confirm.assign_hr.message',
                {assignHR: "<b>" + this.assignHR + "</b>", numberCandidate: this.numberHR})
        });
    }

    inChargeUserField: FormlyFieldConfig = {
        type: 'select',
        key: 'inChargeUser',
        className: 'col-12',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.assign_hr.choose_hr'),
            noSelectText: this.translate.instant('candidate.assign_hr.choose_hr_placeholder'),
            autoFocus: false,
            required: true
        },
        defaultValue: null,
        hooks: {
            onInit: (field) => {
                field.formControl.valueChanges.subscribe(res => {
                    for(var item of this.userHRs){
                        if(res == item.user_id){
                            let label: string = item.full_name;
                            if (item.email && item.email.length > 0) {
                                label = label + ' (' + item.email + ')';
                            }
                            this.assignHR = label;
                        }
                    }
                });
            }
        }
    }

    noteField: FormlyFieldConfig = {
        key: 'note',
        type: 'textarea',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.assign_hr.note'),
            placeholder: this.translate.instant('candidate.assign_hr.note_placeholder'),
            rows: 5,
            required: false,
            maxLength: 1000
        }
    }

    assignHRFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.inChargeUserField,
                this.noteField
            ]
        }
    ];
    assignHRForm: FormGroup = new FormGroup({});

    onInitCandidateInChargeUser() {
        this.userService.getHRList().subscribe(data => {
            if (data.status.success) {
                this.userHRs = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.userHRs) {
                let label: string = item.full_name;
                if (item.email && item.email.length > 0) {
                    label = label + ' (' + item.email + ')';
                }
                let optionInChargeUser: any = {
                    value: item.user_id,
                    label: label
                }
                dataOptions.push(optionInChargeUser);
            }
            this.inChargeUserField.templateOptions.options = dataOptions;
        });
    }

    closeModal() {
        this.bsModalRef.hide();
    }

    acceptSave() {
        let assignHRModel: CandidateAssignModel = new CandidateAssignModel();
        assignHRModel.candidate_ids = this.candidateIds;
        assignHRModel.in_charge_user_id = this.assignHRModel.inChargeUser;
        assignHRModel.note = this.assignHRModel.note;
        this.candidateService.assign(assignHRModel).subscribe(data => {
            if (data.successMessage) {
                this.toastrMessage.showMessageSuccess(data.successMessage, this.translate.instant('shared.common-dialog.info.title'));
            }
            this.assignHRSuccess.emit(true);
            this.cancelAssignHR();
        }, error => {
            if (error.error && error.error.status && !error.error.status.success) {
                this.toastrMessage.showMessageError(error.error.status.code,
                    error.error.status.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }
}
