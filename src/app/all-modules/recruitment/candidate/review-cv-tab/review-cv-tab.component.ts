import {DatePipe} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {take} from "rxjs/operators";
import {CandidateService} from "src/app/core";
import {NotifyType} from 'src/app/core/common/notify-type';
import {CONFIG} from "src/app/core/config/application.config";
import {CandidateModel} from "src/app/core/models/candidate.model";
import {ReviewCVResult} from "src/app/core/models/recruitment.model";
import {InterviewContactModel} from "src/app/core/models/recruitment/interview.contact.model";
import {SaveInterviewContactModel} from 'src/app/core/models/recruitment/save.interview.contact.model';
import {SaveReviewCvModel} from 'src/app/core/models/recruitment/save.review.cv.model';
import {RecruitmentService} from "src/app/core/services/recruitment.service";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";
import {UserStorage} from "src/app/core/storage/user.storage";
import {CommonDialogComponent} from 'src/app/sharing/common-dialog/common-dialog.component';
import {DateTimeUtils} from 'src/libs/core/src/utils/date-time.utils';
import {AssignCvReviewerComponent} from "../assign-cv-reviewer/assign-cv-reviewer.component";
import {CandidateDetailComponent} from "../candidate-detail/candidate-detail.component";

@Component({
    selector: 'app-review-cv-tab',
    templateUrl: './review-cv-tab.component.html',
    styleUrls: ['./review-cv-tab.component.css']
})
export class ReviewCvTabComponent implements OnInit, OnChanges {

    @Input() candidateInfo: CandidateModel;
    canEditCvReviewer: boolean = false;
    candidateStatusValid: boolean = false;    // candidate has status R4 is valid
    candidateViewAddNewAssignCV: boolean = false;    // candidate has status R4, R5, R5.0, R5.1 is valid
    canAddAssignReviewCV: boolean = false;             // current user can review cv ?
    canReviewCV: boolean = false;             // current user can review cv ?
    canEditContactForm: boolean = false;
    canSaveInterviewContact: boolean = false;             // current user can review cv ?
    cvPass: boolean = false;
    isInchargeHr = false;
    modalRef: BsModalRef;
    interviewContact: any = null;
    showContactForm = false;
    @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;

    reviewCvResults: ReviewCVResult[] = [];
    resultMap = {
        true: 'recruitment.enum.review_result.pass',
        false: 'recruitment.enum.review_result.failure'
    }

    reviewStatusField: FormlyFieldConfig = {
        key: 'reviewStatus',
        type: 'radio',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.interview.result_of_evaluation'),
            required: true,
            display: 'horizontal-inline',
            options: [
                {value: true, label: this.translate.instant('candidate.interview.achieved')},
                {value: false, label: this.translate.instant('candidate.interview.not_achieved')}
            ],
        },
        defaultValue: null
    };

    noteReviewField: FormlyFieldConfig = {
        key: 'note',
        type: 'textarea',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.interview.review_note'),
            placeholder:this.translate.instant('candidate.assign.enter_note'),
            rows: 3,
            required: true,
            maxLength: 1000
        }
    }

    reviewerUserFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.reviewStatusField,
                this.noteReviewField
            ]
        }
    ];
    reviewerUserForm: FormGroup = new FormGroup({});

    reviewerUserModel: any = {};


    contactResponse = 0;

    contactTimeField: FormlyFieldConfig = {
        type: 'date',
        key: 'contactTime',
        className: 'col-3',
        defaultValue: null,
        templateOptions: {
            maxLength: 10,
            label: this.translate.instant('candidate.contact_history.contact_time'),
            placeholder: 'DD/MM/YYYY',
            nextMonth: false,
            required: true,
            maxDate: moment().format('DD/MM/YYYY')
        }
    }

    candidateResponseField: FormlyFieldConfig = {
        key: 'candidateResponse',
        type: 'radio',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.contact_history.response'),
            required: true,
            display: 'horizontal-inline',
            options: [
                {value: 1, label: this.translate.instant('candidate.interview.agree_to_participate')},
                {value: 0, label: this.translate.instant('candidate.interview.refused_to_participate')}
            ],
        },
        defaultValue: 1
    };

    noteContactField: FormlyFieldConfig = {
        key: 'note',
        type: 'textarea',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.assign.note'),
            placeholder: this.translate.instant('candidate.assign.enter_note'),
            rows: 3,
            maxLength: 1000
        }
    }

    interviewContactFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.contactTimeField,
                this.candidateResponseField,
                this.noteContactField
            ]
        }
    ];
    interviewContactForm: FormGroup = new FormGroup({});

    interviewContactModel: any = {};

    constructor(private userStorage: UserStorage,
                private modalService: BsModalService,
                private datePipe: DatePipe,
                private candidateService: CandidateService,
                private translate: TranslateService,
                private toastrMessage: ToastrMessageService,
                private detailComponent: CandidateDetailComponent,
                private recruitmentService: RecruitmentService) {
    }

    private checkViewAddNewAssignCV(): boolean {
        return CONFIG.CANDIDATE.STATUS_CODE_ADD_NEW_ASSIGN_CV.includes(this.candidateInfo.status.code);
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['candidateInfo'] && this.candidateInfo) {
            this.candidateViewAddNewAssignCV = this.checkViewAddNewAssignCV();
            this.isInchargeHr = this.checkIsInchargeHr();
        }
    }

    ngOnInit(): void {
        this.canAddAssignReviewCV = this.userStorage.existPermission('edit_cv_reviewer');
        this.canEditCvReviewer = this.userStorage.existPermission('edit_cv_reviewer');
        this.canEditContactForm = this.userStorage.existPermission('edit_interview_contact_all');
        this.canSaveInterviewContact = this.userStorage.existPermission('edit_interview_contact');
        this.initByDetailReviewCVTab();
        this.getCVReviewResult();
    }

    checkIsInchargeHr(): boolean {
        const currentUser = this.userStorage.getUserInfo();
        return this.candidateInfo.in_charge_user_id == currentUser.userId;
    }

    getCVReviewResult(): void {
        this.recruitmentService.getReviewCvResult(this.candidateInfo.candidate_id).pipe(
            take(1)
        ).subscribe(response => {
            this.reviewCvResults = response.data;
            this.canReviewCV = this.reviewCvResults.some(result => {
                return result.reviewer.employeeCode == this.userStorage.getUserInfo().userCode
            });
            this.cvPass = this.reviewCvResults.some(result => result.reviewer_status);
            for (let reviewCVResult of this.reviewCvResults) {
                if (reviewCVResult.reviewer.employeeCode == this.userStorage.getUserInfo().userCode) {
                    this.reviewerUserModel.reviewStatus = reviewCVResult.reviewer_status;
                    this.reviewerUserModel.note = reviewCVResult.note;
                }
            }
        })
    }

    removeCvReviewer(data: any) {
        this.recruitmentService.removeReviewer(data.id).subscribe(response => {
            this.reviewCvResults = this.reviewCvResults.filter(result => result.id != data.id);
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.remove_assign_cv_reviewer_success'),
                this.translate.instant('shared.common-dialog.info.title'));
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    confirmRemoveCvReviewer(id: number): void {
        this.confirmDialog.openModal(null, {id: id}, {
            title: 'recruitment.title.confirm_remove_cv_reviewer_title',
            type: NotifyType.warn,
            btnConfirm: 'candidate.btn.confirm',
            message: 'recruitment.title.confirm_remove_cv_reviewer_message'
        });
    }

    openAddNewAssignCvReviewer(): void {
        this.modalRef = this.modalService.show(AssignCvReviewerComponent, {
            class: 'modal-left modal-dialog-centered w-60 max-width-modal expand',
            initialState: {
                candidateId: this.candidateInfo.candidate_id,
                reviewCvResults: this.reviewCvResults
            }
        });

        if (this.modalRef) {
            (<AssignCvReviewerComponent>this.modalRef.content).assignCvReviewerSuccess.subscribe((res: boolean) => {
                if (res) {
                    this.getCVReviewResult();
                }
            });
        }
    }

    saveReviewResult(): void {
        if (this.reviewerUserForm.invalid) {
            this.reviewerUserForm.markAsTouched();
            return;
        }
        let saveReviewCvModel: SaveReviewCvModel = new SaveReviewCvModel();
        saveReviewCvModel.candidate_id = this.candidateInfo.candidate_id;
        saveReviewCvModel.review_status = this.reviewerUserModel.reviewStatus;
        saveReviewCvModel.note = this.reviewerUserModel.note;

        this.recruitmentService.saveReviewResult(saveReviewCvModel).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.save_cv_review_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                this.getCVReviewResult();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    saveInterviewContact(): void {
        if (this.interviewContactForm.invalid) {
            this.interviewContactForm.markAllAsTouched();
            return;
        }

        let saveInterviewContactModel: SaveInterviewContactModel = new SaveInterviewContactModel();
        if (this.interviewContactModel.contactTime) {
            saveInterviewContactModel.contactTime = this.datePipe.transform(this.interviewContactModel.contactTime, 'yyyy-MM-dd') + 'T00:00:00Z';
        }
        saveInterviewContactModel.candidateId = this.candidateInfo.candidate_id;
        saveInterviewContactModel.candidateResponse = this.interviewContactModel.candidateResponse;
        saveInterviewContactModel.note = this.interviewContactModel.note;
        this.recruitmentService.saveInterviewContact(saveInterviewContactModel).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.save_interview_contact_success'),
                    this.translate.instant('shared.common-dialog.info.title'));

                this.initByDetailReviewCVTab();
                this.detailComponent.getCandidateDetail();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    initByDetailReviewCVTab(): void {
        this.recruitmentService.getInterviewInfo(this.candidateInfo.candidate_id).pipe(
            take(1)
        ).subscribe(data => {
            if (this.canEditContactForm || this.isInchargeHr) {
                this.interviewContactForm.enable();
            } else {
                this.interviewContactForm.disable();
            }
            if (data.data.interviewContact) {
                this.interviewContactForm.disable();
            }
            if (data.status && data.status.success) {
                this.interviewContact = data.data.interviewContact;
                if (data.data.interviewContact) {
                    let interviewContact: InterviewContactModel = data.data.interviewContact;
                    this.contactTimeField.formControl?.setValue(DateTimeUtils.parser(interviewContact.contactTime, 'YYYY-MM-DD'));
                    this.candidateResponseField.formControl?.setValue(interviewContact.candidateResponse);
                    this.noteContactField.formControl?.setValue(interviewContact.note);
                }
            }
        })
    }

    public getDisplayName(reviewCVResult: ReviewCVResult): string {
        if (reviewCVResult.reviewer && reviewCVResult.reviewer.employeeCode) {
            let displayName = reviewCVResult.reviewer.employeeCode;
            displayName = displayName + ' (' + reviewCVResult.reviewer.fullName + ')';
            return displayName;
        }
        return "";
    }

}
