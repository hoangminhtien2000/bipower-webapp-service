import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { FormlyFieldConfig } from "@ngx-formly/core";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CatalogItemAddModel } from "src/app/core/models/catalog.item.add.model";
import { CatalogItemModel } from "src/app/core/models/catalog.item.model";
import { CatalogItemService } from "src/app/core/services/catalog.item.service";
import { ToastrMessageService } from "src/app/core/services/toastr.message.service";
import { CandidateAddOtherItemComponent } from '../candidate-add-other-item/candidate-add-other-item.component';

@Component({
    selector: 'app-dialog-add-evaluation-criteria',
    templateUrl: './dialog-add-evaluation-criteria.component.html',
    styleUrls: ['./dialog-add-evaluation-criteria.component.scss']
})
export class DialogAddEvaluationCriteriaComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private modalService: BsModalService,
        private translate: TranslateService,
        public toastrMessage: ToastrMessageService,
        public catalogItemService: CatalogItemService
    ) {
    }

    titleAddEvaluationCriteria: string = "";
    catalogCode: string = "";
    parentId: number = null;
    catalogItemEvaluationCriteria: CatalogItemModel[] = [];
    @Output() addEvaluationCriteriaSuccess = new EventEmitter<CatalogItemModel>();
    @Output() addEvaluationCriteriaHide = new EventEmitter<boolean>();

    modalRef: BsModalRef;
    countOpenPopupOther: number = 0;

    itemEvaluationCriteriaModel: any = {};

    itemEvaluationCriteriaField: FormlyFieldConfig = {
        key: 'itemEvaluationCriteria',
        type: 'select',
        className: 'col-12',
        templateOptions: {
            required: true,
            maxLength: 100
        },
        hooks: {
            onInit: (field) => {
                field.formControl.valueChanges.subscribe(itemEvaluationCriteriaId => {
                    if (itemEvaluationCriteriaId == -1) {
                        this.openPopupAddEvaluationCriteria();
                    }
                });
            }
        }
    }

    itemEvaluationCriteriaFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.itemEvaluationCriteriaField
            ]
        }
    ];
    itemEvaluationCriteriaForm: FormGroup = new FormGroup({});

    ngOnInit() {
        this.itemEvaluationCriteriaField.templateOptions.label = this.translate.instant('recruitment.add_evaluation_criteria.criteria');
        this.itemEvaluationCriteriaField.templateOptions.placeholder = this.translate.instant('recruitment.add_evaluation_criteria.criteria_placeholder');
        this.onInitCatalogItemEvaluationCriteria();
    }

    cancelCatalogItemOtherAdd() {
        this.addEvaluationCriteriaHide.emit(true);
        this.bsModalRef.hide();
    }

    onInitCatalogItemEvaluationCriteria() {
        this.catalogItemService.getItems(this.catalogCode).subscribe(data => {
            if (data.status.success) {
                this.catalogItemEvaluationCriteria = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemEvaluationCriteria) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.addOptionOther(dataOptions);
            this.itemEvaluationCriteriaField.templateOptions.options = dataOptions;
        });
    }

    private addOptionOther(dataOptions: any[]) {
        let dataOptionStatusOther: any = {
            value: -1,
            label: this.translate.instant('candidate.add_item_other.other_option')
        };
        dataOptions.push(dataOptionStatusOther);
    }

    saveCatalogItemOther() {
        this.itemEvaluationCriteriaForm.markAllAsTouched();
        if (this.itemEvaluationCriteriaForm.invalid) {
            return;
        }
        for(let data of this.catalogItemEvaluationCriteria){
            if(data.item_id == this.itemEvaluationCriteriaModel.itemEvaluationCriteria){
                this.addEvaluationCriteriaSuccess.emit(data);
                this.bsModalRef.hide();
            }
        }
    }

    closeModal() {
        this.addEvaluationCriteriaHide.emit(true);
        this.bsModalRef.hide();
    }

    private openPopupAddEvaluationCriteria() {
        this.countOpenPopupOther++;
        if (this.countOpenPopupOther == 1) {
          this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
            initialState: {
              catalogCode: this.catalogCode,
              otherItem: this.translate.instant('recruitment.add_evaluation_criteria.criteria'),
              titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
                  {itemName: this.translate.instant('recruitment.add_evaluation_criteria.criteria').toLowerCase()})
            },
            class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
            ignoreBackdropClick: true,
            keyboard: false
          });
    
          if (this.modalRef) {
            (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
              if (res.item_id > 0) {
                this.itemEvaluationCriteriaField.formControl.setValue(res.item_id);
                this.itemEvaluationCriteriaField.formControl.markAllAsTouched();
                this.onInitCatalogItemEvaluationCriteria();
                this.countOpenPopupOther = 0;
              }
            });
            (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
              if (res) {
                this.itemEvaluationCriteriaField.formControl.setValue(null);
                this.itemEvaluationCriteriaField.formControl.markAllAsTouched();
                this.countOpenPopupOther = 0;
              }
            });
          }
        }
      }

}
