import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {CreateItemRequest} from "../../../../core/models/team.model";
import {catchError, take} from "rxjs/operators";
import {CatalogCode} from "../../containers/team-info/team-info.component";
import {ToastrService} from "ngx-toastr";
import {BehaviorSubject, throwError} from "rxjs";
import {TeamValidator} from "../../team.validator";
import {CatalogItemService} from "../../../../core/services/catalog.item.service";
import {BsModalRef} from "ngx-bootstrap/modal";
import {TeamService} from "../../../../core/services/team.service";
import {TranslateService} from "@ngx-translate/core";

declare const $;

@Component({
    selector: 'app-create-item-dialog',
    templateUrl: './create-item-dialog.component.html',
    styleUrls: ['./create-item-dialog.component.css']
})
export class CreateItemDialogComponent implements OnInit, OnChanges{

    @Input() catalog_code: CatalogCode;
    modalTitle: string;
    field: string;
    placeHolder: string = '';
    techForm: FormGroup;
    itemSubject = new BehaviorSubject<any>(null);

    constructor(private teamService: TeamService,
                private modalRef: BsModalRef,
                private catalogService: CatalogItemService,
                private translate : TranslateService,
                private toastService: ToastrService,
                private teamValidator: TeamValidator) {
    }

    ngOnInit(): void {
        if (this.catalog_code === 'CANDIDATE_DOMAIN') {
            this.modalTitle = 'TEAM.TITLE.ADD_OTHER_DOMAIN';
            this.field = 'TEAM.TITLE.OTHER_DOMAIN';
            this.placeHolder = 'TEAM.PLACEHOLDER.OTHER_DOMAIN';
        }
        if (this.catalog_code === 'TECHNOLOGY') {
            this.modalTitle = 'TEAM.TITLE.ADD_OTHER_TECH';
            this.field = 'TEAM.TITLE.OTHER_TECH';
            this.placeHolder = 'TEAM.PLACEHOLDER.OTHER_TECH';
        }
        this.initForm();
    }

    ngOnChanges(changes: SimpleChanges) {

    }

    initForm(): void {
        this.techForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.maxLength(50)])
        });
    }

    onCancel(): void {
        this.initForm();
        this.modalRef.hide();
    }

    onSubmit(): void {
        const {valid, value} = this.techForm;
        if (!valid) {
            this.techForm.markAllAsTouched();
            return;
        }
        const request: CreateItemRequest = {
            catalog_code: this.catalog_code,
            name: (value.name || '').trim(),
            code: '' // backend generate automatically if empty
        };
        this.techForm.patchValue(request);
        this.catalogService.createItem(request).pipe(
            take(1),
            catchError(error => {
                this.teamValidator.handleResponseError(error);
                return throwError(error);
            })
        ).subscribe(response => {
            this.itemSubject.next(response.data);
            this.toastService.success(response.status.message);
            // this.saveSuccess.emit(response.data);
            this.onCancel();
        });
    }

}
