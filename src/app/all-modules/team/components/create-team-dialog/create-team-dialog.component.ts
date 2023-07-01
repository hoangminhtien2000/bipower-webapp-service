import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Catalog} from "../../../../core/models/catalog.model";
import {catchError, delay, take, tap} from "rxjs/operators";
import {CreateTeamRequest} from "../../../../core/models/team.model";
import {ToastrService} from "ngx-toastr";
import {TeamValidator} from "../../team.validator";
import {BehaviorSubject, throwError} from "rxjs";
import {CatalogItemService} from "../../../../core/services/catalog.item.service";
import {BsModalRef} from "ngx-bootstrap/modal";
import {TeamService} from "../../../../core/services/team.service";
import {CONFIG} from "../../../../core/config/application.config";

declare const $;

@Component({
    selector: 'app-create-team-dialog',
    templateUrl: './create-team-dialog.component.html',
    styleUrls: ['./create-team-dialog.component.css']
})
export class CreateTeamDialogComponent implements OnInit, AfterViewInit {

    @Input() modalId: string;
    @Output() created =  new EventEmitter<any>();
    saveSubject$ = new BehaviorSubject<any>(null);
    teamForm: FormGroup;
    teamTypes: Catalog[] = [];

    constructor(private teamService: TeamService,
                private modalRef: BsModalRef,
                private catalogService: CatalogItemService,
                private toastService: ToastrService,
                private teamValidator: TeamValidator) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getTeamType();
    }

    ngAfterViewInit() {
        const modal: any = $("#" + this.modalId);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    /**
     * init form data
     */
    initForm(): void {
        this.teamForm = new FormGroup({
            name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
            type: new FormControl('', Validators.required),
            note: new FormControl('', [Validators.maxLength(500)])
        });
    }

    /**
     * handle form submit
     */

    onSubmit(): void {
        const {valid, value} = this.teamForm;
        if (!valid) {
            Object.keys(this.teamForm.controls).forEach(control => {
                this.teamForm.controls[control].markAsDirty();
            })
            this.teamForm.markAllAsTouched();
            return;
        }
        const request: CreateTeamRequest = {
            name: (value.name || '').trim(),
            team_type_id: value.type.item_id,
            note: (value.note || '').trim()
        };
        this.teamForm.patchValue(request);
        this.teamService.createTeam(request).pipe(
            take(1),
            catchError((error) => {
                this.teamValidator.handleResponseError(error)
                return throwError((error));
            })
        ).subscribe(response => {
            this.toastService.success(response.status.message);
            this.created.emit(response.data);
            this.saveSubject$.next(response);
            this.onCancel();
        })
    }

    /**
     * handle close modal
     */
    onCancel(): void {
        this.initForm();
        this.modalRef.hide();
    }

    /**
     * get list of team type
     */
    getTeamType(): void {
        this.catalogService.getItemByCatalog(CONFIG.CATALOG_CODE.TEAM_TYPE).pipe(
            take(1)
        ).subscribe(response => {
            this.teamTypes = response.data;
        });
    }

}
