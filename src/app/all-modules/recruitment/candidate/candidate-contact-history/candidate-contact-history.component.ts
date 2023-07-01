import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {DatePipe} from "@angular/common";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {CandidateContactHistoryModel} from "src/app/core/models/candidate.contact.history.model";
import {CONFIG} from "src/app/core/config/application.config";
import {CATALOG_ITEM} from "src/app/core/common/constant";

@Component({
    selector: 'app-candidate-contact-history',
    templateUrl: './candidate-contact-history.component.html',
    styleUrls: ['./candidate-contact-history.component.scss']
})
export class CandidateContactHistoryComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private datePipe: DatePipe,
        private translate: TranslateService,
        public catalogItemService: CatalogItemService,
    ) {
    }

    catalogItemContact: CatalogItemModel[] = [];
    catalogItemContactStatus: CatalogItemModel[] = [];
    catalogItemStatusAfterContact: CatalogItemModel[] = [];
    catalogItemResponse: CatalogItemModel[] = [];
    catalogItemCandidateStatus: CatalogItemModel[] = [];

    @Output() candidateContactHistoryData = new EventEmitter<CandidateContactHistoryModel>();
    candidateContactHistoryModel: any = {};
    candidateContactHistoryTitle: string;
    ngOnInit() {
        if (!this.candidateContactHistoryModel.candidateStatus) {
            this.candidateContactHistoryModel.candidateStatus = null;
        }
        this.onInitCandidateContact();
        this.onInitCandidateContactStatus();
        this.onInitCandidateStatusAfterContact();
        this.onInitCandidateContactResponse();
        this.onInitCandidateStatus();
        if (this.candidateContactHistoryModel.contactStatus) {
            this.updateAndReloadContactStatus(this.candidateContactHistoryModel.contactStatus);
        }
    }

    cancelSupportHistory() {
        this.bsModalRef.hide();
    }

    saveSupportHistory() {
        if (this.candidateContactHistoryForm.invalid) {
            this.candidateContactHistoryForm.markAllAsTouched();
            return;
        }

        let model: CandidateContactHistoryModel = new CandidateContactHistoryModel();
        model.candidate_status_id = this.candidateContactHistoryModel.candidateStatus;
        for (let candidateStatus of this.catalogItemCandidateStatus) {
            if (candidateStatus.item_id == this.candidateContactHistoryModel.candidateStatus) {
                model.candidate_status = candidateStatus;
            }
        }
        model.note = this.candidateContactHistoryModel.note;
        model.contact_time = this.datePipe.transform(this.candidateContactHistoryModel.contactTime, 'yyyy-MM-dd') + 'T00:00:00Z';

        model.contact_id = this.candidateContactHistoryModel.contact;
        for (let contact of this.catalogItemContact) {
            if (contact.item_id == this.candidateContactHistoryModel.contact) {
                model.contact = contact;
            }
        }

        model.contact_status_id = this.candidateContactHistoryModel.contactStatus;
        for (let contactStatus of this.catalogItemContactStatus) {
            if (contactStatus.item_id == this.candidateContactHistoryModel.contactStatus) {
                model.contact_status = contactStatus;
            }
        }

        model.status_after_contact_id = this.candidateContactHistoryModel.statusAfterContact;
        for (let contactStatusAfter of this.catalogItemStatusAfterContact) {
            if (contactStatusAfter.item_id == this.candidateContactHistoryModel.statusAfterContact) {
                model.status_after_contact = contactStatusAfter;
            }
        }

        model.response_id = this.candidateContactHistoryModel.response;
        for (let response of this.catalogItemResponse) {
            if (response.item_id == this.candidateContactHistoryModel.response) {
                model.response = response;
            }
        }
        this.candidateContactHistoryData.emit(model);
        this.cancelSupportHistory();
    }

    contactField: FormlyFieldConfig = {
        type: 'select',
        key: 'contact',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.contact_channel'),
            noSelectText: this.translate.instant('candidate.contact_history.contact_channel_placeholder'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    contactTimeField: FormlyFieldConfig = {
        type: 'date',
        key: 'contactTime',
        className: 'col-4',
        defaultValue: null,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.contact_time'),
            placeholder: this.translate.instant('candidate.contact_history.contact_time_placeholder'),
            nextMonth: false,
            required: true,
            maxDate: moment().format('DD/MM/YYYY')
        }
    }
    contactStatusField: FormlyFieldConfig = {
        type: 'select',
        key: 'contactStatus',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.contact_status'),
            noSelectText: this.translate.instant('candidate.contact_history.contact_status_placeholder'),
            autoFocus: false,
            required: true
        },
        hooks: {
            onInit: (field) => {
                field.formControl.valueChanges.subscribe(contactStatusId => {
                    this.updateAndReloadContactStatus(contactStatusId);
                });
            }
        },
        defaultValue: null
    }

    statusAfterContactField: FormlyFieldConfig = {
        type: 'select',
        key: 'statusAfterContact',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.status_after_contact'),
            noSelectText: this.translate.instant('candidate.contact_history.status_after_contact_placeholder'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    responseField: FormlyFieldConfig = {
        type: 'select',
        key: 'response',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.response'),
            noSelectText: this.translate.instant('candidate.contact_history.response_placeholder'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    candidateStatusField: FormlyFieldConfig = {
        type: 'select',
        key: 'candidateStatus',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.candidate_status'),
            noSelectText: this.translate.instant('candidate.contact_history.candidate_status_placeholder'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    noteField: FormlyFieldConfig = {
        key: 'note',
        type: 'textarea',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.note'),
            placeholder: this.translate.instant('candidate.contact_history.note_placeholder'),
            rows: 5,
            required: false
        }
    }

    candidateContactHistoryFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.contactTimeField,
                this.contactField,
                this.contactStatusField,
                this.statusAfterContactField,
                this.responseField,
                this.candidateStatusField,
                this.noteField
            ]
        }
    ];
    candidateContactHistoryForm: FormGroup = new FormGroup({});

    onInitCandidateContact() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_CONTACT).subscribe(data => {
            if (data.status.success) {
                this.catalogItemContact = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemContact) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.contactField.templateOptions.options = dataOptions;
        });
    }

    onInitCandidateContactStatus() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_CONTACT_STATUS).subscribe(data => {
            if (data.status.success) {
                this.catalogItemContactStatus = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemContactStatus) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.contactStatusField.templateOptions.options = dataOptions;
        });
    }

    onInitCandidateStatusAfterContact() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_STATUS_AFTER_CONTACT).subscribe(data => {
            if (data.status.success) {
                this.catalogItemStatusAfterContact = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemStatusAfterContact) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.statusAfterContactField.templateOptions.options = dataOptions;
        });
    }

    onInitCandidateContactResponse() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_RESPONSE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemResponse = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemResponse) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.responseField.templateOptions.options = dataOptions;
        });
    }

    onInitCandidateStatus() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_STATUS).subscribe(data => {
            if (data.status.success) {
                this.catalogItemCandidateStatus = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemCandidateStatus) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.candidateStatusField.templateOptions.options = dataOptions;
        });
    }

    closeModal() {
        this.bsModalRef.hide();
    }

    checkContactStatusContacted(contactStatusId: number) {
        for (let contactStatus of this.catalogItemContactStatus) {
            if (contactStatus.item_id == contactStatusId
                && contactStatus.code == CONFIG.CANDIDATE.CONTACT_STATUS_CONTACTED) {
                return true;
            }
        }
        return false;
    }

    uploadAndValidateContactStatusContacted() {
        this.contactTimeField.templateOptions.required = true;
        this.contactTimeField.formControl?.updateValueAndValidity();

        this.contactField.templateOptions.required = true;
        this.contactField.formControl?.updateValueAndValidity();

        this.statusAfterContactField.templateOptions.required = true;
        this.statusAfterContactField.formControl?.updateValueAndValidity();

        this.responseField.templateOptions.required = true;
        this.responseField.formControl?.updateValueAndValidity();

        this.candidateStatusField.templateOptions.required = true;
        this.candidateStatusField.formControl?.updateValueAndValidity();
    }

    uploadAndValidateContactStatusNoneContacted() {
        this.contactTimeField.templateOptions.required = true;
        this.contactTimeField.formControl?.updateValueAndValidity();

        this.contactField.templateOptions.required = true;
        this.contactField.formControl?.updateValueAndValidity();

        this.statusAfterContactField.templateOptions.required = false;
        this.statusAfterContactField.formControl?.updateValueAndValidity();

        this.responseField.templateOptions.required = false;
        this.responseField.formControl?.updateValueAndValidity();

        this.candidateStatusField.templateOptions.required = true;
        this.candidateStatusField.formControl?.updateValueAndValidity();
    }

    updateAndReloadContactStatus(contactStatusId : number){
        if (this.checkContactStatusContacted(contactStatusId)) {
            this.uploadAndValidateContactStatusContacted();
        } else {
            this.uploadAndValidateContactStatusNoneContacted();
        }
    }
}
