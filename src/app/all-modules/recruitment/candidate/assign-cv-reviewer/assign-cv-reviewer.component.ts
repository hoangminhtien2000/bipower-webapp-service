import {Component, OnDestroy, OnInit, Output, EventEmitter} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {CandidateService, EmployeeService} from "../../../../core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {debounceTime, filter, take, takeUntil} from "rxjs/operators";
import {RecruitmentService} from "../../../../core/services/recruitment.service";
import {multiselectRequire} from "../../recruitment.validators";
import {MultiSelect} from "primeng/multiselect";
import {ToastrMessageService} from "../../../../core/services/toastr.message.service";
import { AssignCvReviewerModel } from 'src/app/core/models/recruitment/assign.cv.reviewer.model';
import { TranslateService } from '@ngx-translate/core';
import {ReviewCVResult} from "../../../../core/models/recruitment.model";

@Component({
    selector: 'app-assign-cv-reviewer',
    templateUrl: './assign-cv-reviewer.component.html',
    styleUrls: ['./assign-cv-reviewer.component.css']
})
export class AssignCvReviewerComponent implements OnInit, OnDestroy {

    employeeList: any[];
    candidateId: number = 0;
    filterControl: FormControl = new FormControl('');
    @Output() assignCvReviewerSuccess = new EventEmitter<boolean>();
    unsubscribe$ = new Subject<void>();
    formAssign: FormGroup;
    reviewCvResults: ReviewCVResult[] = [];

    constructor(private modalRef: BsModalRef,
                private candidateService: CandidateService,
                private translate: TranslateService,
                private employeeService: EmployeeService,
                private toastrMessage: ToastrMessageService,
                private recruitmentService: RecruitmentService) {
    }

    ngOnInit(): void {
        this.initForm();
        this.getEmployeeList('d');
        this.suggestEmployee();
    }

    initForm(): void {
        this.formAssign = new FormGroup({
            reviewers: new FormControl([], multiselectRequire),
            note: new FormControl('', [
                Validators.required,
                Validators.maxLength(1000)])
        });
    }

    suggestEmployee(): void {
        this.filterControl.valueChanges.pipe(
            filter(value => value),
            debounceTime(500),
            takeUntil(this.unsubscribe$)
        ).subscribe(query => {
            this.getEmployeeList(query);
        })
    }

    getEmployeeList(query: string): void {
        this.employeeService.searchEmployeeForSuggest(query)
            .pipe(take(1))
            .subscribe(response => {
                if (!response.data) {
                    this.employeeList = [];
                    return;
                }
                const selected = this.reviewCvResults.map(element => element.reviewer_id);
                this.employeeList = (response.data as any[]).map(emp => ({
                    id: emp.id,
                    companyEmail: emp.companyEmail,
                    display: `${this.getCompanyAccount(emp.companyEmail)} (${emp.firstName} ${emp.lastName})`
                })).filter(element => !selected.includes(element.id)).sort((a, b) => {
                    if (a.display < b.display) return - 1;
                    if (a.display > b.display) return 1;
                    return 0;
                });
            });
    }

    removeRow(event: any, id: number, multipleSelect: MultiSelect): void {
        const newValue = (this.formAssign.get('reviewers').value as any[])
            .filter(el => el.id != id);
        this.formAssign.get('reviewers').patchValue(newValue);
        event.preventDefault();
        event.stopPropagation();
    }

    /**
     * get company account
     * @param companyEmail
     */
    getCompanyAccount(companyEmail: string): string {
        try {
            return companyEmail.match(/^([^@]*)@/)[1];
        } catch (e) {
            return companyEmail;
        }
    }

    submitForm(): void {
        const {valid, value} = this.formAssign;
        if (!valid) {
            this.formAssign.markAllAsTouched();
            return;
        }

        const requestPayload: AssignCvReviewerModel = new AssignCvReviewerModel();
        requestPayload.candidate_id = this.candidateId;
        requestPayload.reviewers = value.reviewers.map(reviewer => reviewer.id);
        requestPayload.note = value.note;
        this.recruitmentService.assignReviewer(requestPayload).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.assign_cv_reviewer_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                this.assignCvReviewerSuccess.emit(true);
                this.modalRef.hide();
            }
        }, error=>{
            if (error.error && error.error.status && !error.error.status.success) {
                this.toastrMessage.showMessageError(error.error.status.code,
                    error.error.status.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    closeModal(): void {
        this.modalRef.hide();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
