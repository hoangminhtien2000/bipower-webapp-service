import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {BsModalRef} from "ngx-bootstrap/modal";
import {DatePipe} from "@angular/common";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {CatalogItemAddModel} from "src/app/core/models/catalog.item.add.model";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
    selector: 'app-candidate-add-other-item',
    templateUrl: './candidate-add-other-item.component.html',
    styleUrls: ['./candidate-add-other-item.component.scss']
})
export class CandidateAddOtherItemComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private datePipe: DatePipe,
        private translate: TranslateService,
        public toastrMessage: ToastrMessageService,
        public catalogItemService: CatalogItemService
    ) {
    }

    titleCandidateAddOtherItem: string = "";
    otherItem: string = "";
    catalogCode: string = "";
    parentId: number = null;
    @Output() addOtherItemIdSuccess = new EventEmitter<CatalogItemModel>();
    @Output() addOtherItemIdHide = new EventEmitter<boolean>();

    addOtherItemModel: any = {};

    ngOnInit() {
        this.itemOtherField.templateOptions.label = this.translate.instant('candidate.add_item_other.other_label',
            {itemName: this.otherItem});
        this.itemOtherField.templateOptions.placeholder = this.translate.instant('candidate.add_item_other.other_placeholder',
            {itemName: this.otherItem.toLowerCase()});
    }

    cancelCatalogItemOtherAdd() {
        this.addOtherItemIdHide.emit(true);
        this.bsModalRef.hide();
    }

    saveCatalogItemOther() {
        this.addOtherItemForm.markAllAsTouched();
        if (this.addOtherItemForm.invalid) {
            return;
        }

        let catalogItemAddModel: CatalogItemAddModel = new CatalogItemAddModel();
        catalogItemAddModel.catalog_code = this.catalogCode;
        catalogItemAddModel.parent_id = this.parentId;
        catalogItemAddModel.name = this.addOtherItemModel.itemOther;
        this.catalogItemService.addOtherItem(catalogItemAddModel).subscribe(data => {
            if (data.status.success) {
                this.toastrMessage.showMessageSuccess(data.status.message, this.translate.instant('shared.common-dialog.info.title'));
            }
            this.addOtherItemIdSuccess.emit(data.data);
            this.bsModalRef.hide();
        }, error => {
            if (error.error && error.error.status && !error.error.status.success) {
                this.toastrMessage.showMessageError(error.error.status.code,
                    error.error.status.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    itemOtherField: FormlyFieldConfig = {
        key: 'itemOther',
        type: 'input',
        className: 'col-12',
        templateOptions: {
            required: true,
            maxLength: 100
        }
    }

    addOtherItemFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.itemOtherField
            ]
        }
    ];
    addOtherItemForm: FormGroup = new FormGroup({});

    closeModal() {
        this.addOtherItemIdHide.emit(true);
        this.bsModalRef.hide();
    }

}
