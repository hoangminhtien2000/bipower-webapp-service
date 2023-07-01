import {DatePipe} from '@angular/common';
import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {take} from "rxjs/operators";
import {CandidateService} from "src/app/core";
import {CATALOG_ITEM, RECRUITMENT_PROPOSAL_STATUS} from "src/app/core/common/constant";
import {NotifyType} from 'src/app/core/common/notify-type';
import {CONFIG} from "src/app/core/config/application.config";
import {CandidateModel} from "src/app/core/models/candidate.model";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {ReviewCVResult} from "src/app/core/models/recruitment.model";
import {EvaluationCriteriaModel} from 'src/app/core/models/recruitment/evaluation.criteria.model';
import {InterviewEvaluationModel} from 'src/app/core/models/recruitment/interview.evaluation.model';
import {InterviewScheduleModel} from 'src/app/core/models/recruitment/interview.schedule.model';
import {RecruitmentProposalModel} from 'src/app/core/models/recruitment/recruitment.proposal.model';
import {RejectApprovalProposalModel} from 'src/app/core/models/recruitment/reject.approval.proposal.model';
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {RecruitmentService} from "src/app/core/services/recruitment.service";
import {TeamService} from 'src/app/core/services/team.service';
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";
import {UserStorage} from "src/app/core/storage/user.storage";
import {CommonDialogComponent} from 'src/app/sharing/common-dialog/common-dialog.component';
import {DateTimeUtils} from 'src/libs/core/src/utils/date-time.utils';
import {
    DialogAddEvaluationCriteriaComponent
} from '../dialog-add-evaluation-criteria/dialog-add-evaluation-criteria.component';
import {
    InterviewCandidateScheduleInfoComponent
} from "../interview-candidate-schedule-info/interview-candidate-schedule-info.component";
import * as moment from 'moment';
import {CandidateDetailComponent} from "../candidate-detail/candidate-detail.component";
import {Router} from '@angular/router';

@Component({
    selector: 'app-interview-candidate-tab',
    templateUrl: './interview-candidate-tab.component.html',
    styleUrls: ['./interview-candidate-tab.component.scss']
})
export class InterviewCandidateTabComponent implements OnInit, OnChanges {

    constructor(private userStorage: UserStorage,
                private datePipe: DatePipe,
                private toastrMessage: ToastrMessageService,
                private modalService: BsModalService,
                private candidateService: CandidateService,
                public catalogItemService: CatalogItemService,
                private toastMessage: ToastrMessageService,
                private translate: TranslateService,
                private teamService: TeamService,
                private detailComponent: CandidateDetailComponent,
                private recruitmentService: RecruitmentService,
                private router: Router) {
    }

    @Input() candidateInfo: CandidateModel;
    panelOpenState = false;
    canAddInterviewSchedule: boolean = false;
    candidateViewAddNewScheduleInterview: boolean = false;    // candidate has status R5.2 is valid
    canReviewCV: boolean = false;             // current user can review cv ?
    canCreateDecision = false;                  // current user can create recruitment decision
    isInterviewer = false;
    isHrJoinInterview = false;
    isInchargeHr = false;
    isPassInterview = false;
    hasInterviewResultHr: {[key: number]: boolean} = {};
    hasInterviewResultInterviewer: {[key: number]: boolean} = {};
    canMakeRecruitmentProposal: boolean = false;
    canInterviewEvaluationHR: boolean = false;
    canInterviewEvaluation: boolean = false;
    canAddRecruitmentProposal: boolean = false;
    canApproveRecruitmentProposal: boolean = false;
    canEditSchedule = false;
    modalRef: BsModalRef;
    countOpenPopupEvaluationCriteria: number = 0;

    @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;

    reviewCvResult: ReviewCVResult[] = [];
    interviewSchedules: InterviewScheduleModel[] = [];
    proposals: RecruitmentProposalModel[] = [];
    inteviewEvaluationNotExists: boolean[] = [];

    profestionalEvaluationFormEs: FormControl[][] = [];
    profestionalEvaluationModelEs: EvaluationCriteriaModel[][] = [];

    catalogItemInterviewPlace: CatalogItemModel[] = [];
    catalogItemSpecializeLevel: CatalogItemModel[] = [];


    preInterviewAssessmentModels: any[] = [];
    preInterviewAssessmentForms: FormGroup[] = [];
    preInterviewAssessmentFieldEs: FormlyFieldConfig[][] = [];


    culturalSuitabilityEvaluationFormEs: FormControl[][] = [];
    culturalSuitabilityEvaluationModelEs: EvaluationCriteriaModel[][] = [];

    incomeEvaluationFormEs: FormControl[][] = [];
    incomeEvaluationModelEs: EvaluationCriteriaModel[][] = [];

    commonInfomationEvaluationFormEs: FormControl[][] = [];
    commonInfomationEvaluationModelEs: EvaluationCriteriaModel[][] = [];

    otherEvaluationFormEs: FormControl[][] = [];
    otherEvaluationModelEs: EvaluationCriteriaModel[][] = [];

    interviewResultHRModelEs: any[] = [];
    interviewResultHRFormEs: FormGroup[] = [];
    interviewResultHRFieldEs: FormlyFieldConfig[][] = [];

    interviewResultFieldEs: FormlyFieldConfig[][] = [];
    interviewResultModelEs: any[] = [];
    interviewResultFormEs: FormGroup[] = [];


    recruitmentProposalModelEs: any[] = [];
    recruitmentProposalFormEs: FormGroup[] = [];
    recruitmentProposalFieldEs: FormlyFieldConfig[][] = [];


    radio = 0;
    catalogItemApplyPosition: CatalogItemModel[] = [];
    interviewTypeMap: { [id: number]: CatalogItemModel };

    value = 0;

    private checkViewAddNewScheduleInterview(): boolean {
        const validByStatus = CONFIG.CANDIDATE.STATUS_CODE_INTERVIEW == this.candidateInfo?.status?.code;
        const rejectLastInterview = (this.interviewSchedules||[]).some(sc => sc.isJoined == false);
        return validByStatus || rejectLastInterview;
    }

    private checkMakeRecruitmentProposal(): boolean {
        return this.userStorage.existPermission('edit_recruitment_proposal') ||
            this.userStorage.getUserInfo().userId == this.candidateInfo?.in_charge_user_id;
    }

    public checkStatusRecruitmentProposalEdit(model: RecruitmentProposalModel): boolean {
        if (!model.status || (model.status.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD)) {
            return true;
        }
        return false;
    }

    private getInterviewType(): void {
        this.catalogItemService.getItems(CATALOG_ITEM.INTERVIEW_TYPE).subscribe(res => {
            const items = res.data as CatalogItemModel[];
            this.interviewTypeMap = items.reduce((result, item) => {
                return {
                    ...result,
                    [item.item_id]: item
                }
            }, {});
        })
    }

    private checkApproveRecruitmentProposal(): boolean {
        return this.userStorage.existPermission('approval_recruitment_proposal');
    }

    public checkStatusRecruitmentProposalApprove(model: RecruitmentProposalModel): boolean {
        if (model.status && (model.status.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD ||
            (model.status.code == RECRUITMENT_PROPOSAL_STATUS.HR_LEAD_APPROVED && this.checkApproveRecruitmentProposalBOD()))) {
            return true;
        }
        return false;
    }

    private checkIsInterviewer(): void {
        if (!this.interviewSchedules || this.interviewSchedules.length == 0) {
            this.isInterviewer = false;
        } else {
            const currentSchedule = this.interviewSchedules[this.interviewSchedules.length - 1];
            const currentUser = this.userStorage.getUserInfo();
            this.isInterviewer = currentSchedule.interviewerInfo.findIndex(e => e.employeeCode == currentUser.userCode) > -1;
        }
    }

    private checkApproveRecruitmentProposalHRALead(): boolean {
        return this.userStorage.existPermission('approval_recruitment_proposal_hr_lead');
    }

    public checkStatusRecruitmentProposalApproveHRALead(model: RecruitmentProposalModel): boolean {
        if (model.status && (model.status.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD)) {
            return true;
        }
        return false;
    }

    private checkApproveRecruitmentProposalBOD(): boolean {
        return this.userStorage.existPermission('approval_recruitment_proposal_bod');
    }

    private checkHasInterviewResultHr(): void {
        if (!this.interviewSchedules || this.interviewSchedules.length == 0) {
            this.hasInterviewResultHr = {};
            this.hasInterviewResultInterviewer = {};
        }

        const typeHR = CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.HR;
        const typeInterviewer = CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.INTERVIEWER;
        this.interviewSchedules.forEach((schedule, idx) => {
            this.hasInterviewResultHr = {
                ...this.hasInterviewResultHr,
                [idx]: (schedule.interviewResults || []).some(rs => rs.type == typeHR)
            };

            this.hasInterviewResultInterviewer = {
                ...this.hasInterviewResultInterviewer,
                [idx]: (schedule.interviewResults || []).some(rs => rs.type == typeInterviewer)
            };
        })
    }

    private checkCanEditSchedule(): void {
        this.canEditSchedule = this.userStorage.existPermission('edit_interview_schedule');
    }

    public checkStatusRecruitmentProposalApproveBOD(model: RecruitmentProposalModel): boolean {
        if (model.status && (model.status.code == RECRUITMENT_PROPOSAL_STATUS.HR_LEAD_APPROVED)) {
            return true;
        }
        return false;
    }

    ngOnInit(): void {
        this.canAddInterviewSchedule = this.userStorage.existPermission('edit_cv_reviewer') ||
            this.candidateInfo?.in_charge_user_id == this.userStorage.getUserInfo().userId;
        this.isInchargeHr = this.candidateInfo?.in_charge_user_id == this.userStorage.getUserInfo().userId;
        this.getCVReviewResult();
        this.initByDetailInterviewScheduleTab();
        this.onInitInterviewPlace();
        this.checkIsInterviewer();
        this.onInitCandidateApplyPositionDefault();
        this.onInitCandidateSpecializeLevelDefault();
        this.getInterviewType();
        this.candidateViewAddNewScheduleInterview = this.checkViewAddNewScheduleInterview();
        this.canMakeRecruitmentProposal = this.checkMakeRecruitmentProposal();
        this.canInterviewEvaluation = this.userStorage.existPermission('view_evaluation');
        this.canAddRecruitmentProposal = this.userStorage.existPermission('create_recruitment_proposal') ||
            this.candidateInfo?.in_charge_user_id == this.userStorage.getUserInfo().userId;
        this.canApproveRecruitmentProposal = this.checkApproveRecruitmentProposal();
        this.canInterviewEvaluationHR = true;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['candidateInfo'] && this.candidateInfo) {
            this.candidateViewAddNewScheduleInterview = this.checkViewAddNewScheduleInterview();
        }
        this.isCanCreateDecision();
    }

    /**
     * check current user can create recruitment decision
     */
    isCanCreateDecision(): void {
        const hasValidObject = this.userStorage.existPermission('create_recruitment_decision');
        let isInchargeHr = false;
        const currentUser = this.userStorage.getUserInfo();
        if (currentUser && this.candidateInfo) {
            isInchargeHr = this.candidateInfo.in_charge_user_id == currentUser.userId;
        }
        this.canCreateDecision = hasValidObject || isInchargeHr;
    }

    initProfestionalEvaluation(): void {
        let profestionalEvaluationModels: EvaluationCriteriaModel[] = [];
        let profestionalEvaluationForms: FormControl[] = [];
        this.profestionalEvaluationModelEs.push(profestionalEvaluationModels);
        this.profestionalEvaluationFormEs.push(profestionalEvaluationForms);

        this.catalogItemService.getItems(CATALOG_ITEM.PROFESTIONAL_EVALUATION).subscribe(data => {
            if (data.status.success) {
                let catalogItems: CatalogItemModel[] = data.data;
                for (let catalogItem of catalogItems) {
                    if (catalogItem.is_default) {
                        let professionalAssessmentResult: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        professionalAssessmentResult.criteriaId = catalogItem.item_id;
                        professionalAssessmentResult.criteriaName = catalogItem.name;
                        professionalAssessmentResult.type = CATALOG_ITEM.PROFESTIONAL_EVALUATION;
                        professionalAssessmentResult.evaluation = "";
                        profestionalEvaluationModels.push(professionalAssessmentResult);
                        this.onAddProfessionalAssessment(profestionalEvaluationForms, professionalAssessmentResult);;
                    }
                }
            }
        });
    }

    getCVReviewResult(): void {
        const candidateId = Number(this.candidateService.getCandidateDetailId());
        if (!candidateId) {
            return;
        }
        this.recruitmentService.getReviewCvResult(candidateId).pipe(
            take(1)
        ).subscribe(response => {
            this.reviewCvResult = response.data;
            this.canReviewCV = this.reviewCvResult.some(result => {
                return result.reviewer_id == this.userStorage.getUserInfo().userId
            })
        })
    }

    removeCvReviewer(id: number): void {
        this.confirmDialog.openModal(null, null, {
            title: 'recruitment.title.confirm_remove_cv_reviewer_title',
            type: NotifyType.warn,
            btnConfirm: 'candidate.btn.confirm',
            message: 'recruitment.title.confirm_remove_cv_reviewer_message'
        });


        // this.translate.get([titleCode, messageCode]).subscribe(message => {
        //     const modalRef = this.modalService.show(ConfirmModalComponent, {
        //         class: 'modal-left modal-dialog-centered w-40',
        //         initialState: {
        //             title: message[titleCode],
        //             message: message[messageCode]
        //         }
        //     });

        //     modalRef.content.result$.pipe(
        //         take(1),
        //         filter(result => result == true),
        //         switchMap(() => this.recruitmentService.removeReviewer(id))
        //     ).subscribe(response => {
        //         const {message, code} = response.status;
        //         this.toastMessage.showMessageSuccess(message, code);
        //         this.reviewCvResult = this.reviewCvResult.filter(result => result.id != id);
        //     });
        // });
    }

    openAddNewProfestionalEvaluation(index: number): void {
        this.countOpenPopupEvaluationCriteria++;
        if (this.countOpenPopupEvaluationCriteria == 1) {
            this.modalRef = this.modalService.show(DialogAddEvaluationCriteriaComponent, {
                initialState: {
                    catalogCode: CATALOG_ITEM.PROFESTIONAL_EVALUATION,
                    titleAddEvaluationCriteria: this.translate.instant('recruitment.interview.profestional_evaluation')
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            });

            if (this.modalRef) {
                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaSuccess.subscribe((res: CatalogItemModel) => {
                    if (res.item_id > 0) {
                        const existed = this.profestionalEvaluationModelEs[index].some(rs => rs.criteriaId == res.item_id);
                        if (existed) {
                            this.toastMessage.showMessageError('DUPLICATE_CRITERIA', this.translate.instant('candidate.interview.evaluation_criteria_already_exist'), '');
                            return;
                        }
                        let professionalAssessmentResult: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        professionalAssessmentResult.criteriaId = res.item_id;
                        professionalAssessmentResult.criteriaName = res.name;
                        professionalAssessmentResult.type = CATALOG_ITEM.PROFESTIONAL_EVALUATION;
                        professionalAssessmentResult.evaluation = "";
                        this.profestionalEvaluationModelEs[index].push(professionalAssessmentResult);
                        this.onAddProfessionalAssessment(this.profestionalEvaluationFormEs[index], professionalAssessmentResult);
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });

                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaHide.subscribe((res: boolean) => {
                    if (res) {
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });
            }
        }
    }

    openAddNewInterviewSchedule(): void {
        let dataModel: InterviewScheduleModel = new InterviewScheduleModel();
        dataModel.candidateId = this.candidateInfo.candidate_id;
        this.modalRef = this.modalService.show(InterviewCandidateScheduleInfoComponent, {
            class: 'modal-left modal-dialog-centered w-60 max-width-modal expand',
            initialState: {
                interviewCandidateScheduleInfoTitle: this.translate.instant('candidate.interview.interview_schedule_information'),
                interviewScheduleModel: dataModel
            }
        });

        if (this.modalRef) {
            (<InterviewCandidateScheduleInfoComponent>this.modalRef.content).saveInterviewScheduleSuccess.subscribe((res: boolean) => {
                if (res) {
                    this.initByDetailInterviewScheduleTab();
                }
            });
        }
    }

    openUpdateInterviewSchedule(interviewScheduleModel: InterviewScheduleModel): void {
        let dataModel: any = {};
        dataModel = interviewScheduleModel;
        dataModel.candidateId = this.candidateInfo.candidate_id;
        dataModel.hr = interviewScheduleModel.hrId;
        dataModel.place = interviewScheduleModel.placeId;
        dataModel.interviewType = interviewScheduleModel.interviewTypeId;
        dataModel.interviewer = interviewScheduleModel.interviewerId;
        dataModel.durationInterviewTime = {
            from: moment(dataModel.interviewFromTime, 'YYYY-MM-DD[T]HH:mm:ss[Z]').toDate(),
            to: moment(dataModel.interviewToTime, 'YYYY-MM-DD[T]HH:mm:ss[Z]').toDate()
        }
        dataModel.interviewTime = DateTimeUtils.parser(interviewScheduleModel.interviewFromTime, 'YYYY-MM-DD');
        this.modalRef = this.modalService.show(InterviewCandidateScheduleInfoComponent, {
            class: 'modal-left modal-dialog-centered w-60 max-width-modal expand',
            initialState: {
                interviewCandidateScheduleInfoTitle: this.translate.instant('candidate.interview.update_interview_schedule_information'),
                interviewScheduleModel: dataModel
            }
        });

        if (this.modalRef) {
            (<InterviewCandidateScheduleInfoComponent>this.modalRef.content).saveInterviewScheduleSuccess.subscribe((res: boolean) => {
                if (res) {
                    this.initByDetailInterviewScheduleTab();
                    this.detailComponent.getCandidateDetail();
                }
            });
        }
    }

    checkIsPassInterview(): boolean {
        if (!this.interviewSchedules || this.interviewSchedules.length == 0) {
            return false;
        }
        const currentSchedule = this.interviewSchedules[this.interviewSchedules.length - 1];
        return currentSchedule.interviewResults
            .filter(rs => rs.decision)
            .length == 2;
    }

    checkExistInterviewEvaluation(index: number) {
        return this.interviewSchedules[index].interviewerInfo.findIndex(e => e.employeeCode == this.userStorage.getUserInfo().userCode) > -1;
    }

    saveInterviewSchedule(index: number): void {
        let model: InterviewScheduleModel = this.interviewSchedules[this.interviewSchedules.length - 1];
        model.candidateId = this.candidateInfo.candidate_id;
        model.currentSalary = this.preInterviewAssessmentModels[index].currentSalary;
        model.expectSalary = this.preInterviewAssessmentModels[index].expectSalary;
        if (this.preInterviewAssessmentModels[index].onboardTime) {
            model.onboardTime = this.datePipe.transform(this.preInterviewAssessmentModels[index].onboardTime, 'yyyy-MM-dd') + 'T00:00:00Z';
        }
        model.note = this.preInterviewAssessmentModels[index].note;
        model.isJoined = this.preInterviewAssessmentModels[index].isJoined;

        model.interviewerIdList = this.preInterviewAssessmentModels[index].interviewerId?.split(",");
        this.recruitmentService.saveInterviewSchedule(model).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_schedule_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                this.detailComponent.getCandidateDetail();
                this.initByDetailInterviewScheduleTab();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    private openPopupAddOtherPlace() {

    }

    onAddProfessionalAssessment(profestionalEvaluationForms: FormControl[], professionalAssessmentResult: EvaluationCriteriaModel) {
        let profestionalEvaluationForm: FormControl = new FormControl();
        profestionalEvaluationForm.setValue(professionalAssessmentResult.evaluation);
        profestionalEvaluationForms.push(profestionalEvaluationForm);
        let professionalAssessment: any = {
            professionalAssessment: professionalAssessmentResult.criteriaId
        };
        if (!this.isInterviewer) {
            profestionalEvaluationForm.disable();
        }
    }

    initCulturalSuitabilityEvaluation(): void {
        let culturalSuitabilityEvaluationModels: EvaluationCriteriaModel[] = [];
        let culturalSuitabilityEvaluationFroms: FormControl[] = [];
        this.culturalSuitabilityEvaluationModelEs.push(culturalSuitabilityEvaluationModels);
        this.culturalSuitabilityEvaluationFormEs.push(culturalSuitabilityEvaluationFroms);
        this.catalogItemService.getItems(CATALOG_ITEM.CULTURAL_SUITABILITY).subscribe(data => {
            if (data.status.success) {
                let catalogItems: CatalogItemModel[] = data.data;
                for (let catalogItem of catalogItems) {
                    if (catalogItem.is_default) {
                        let culturalSuitabilityEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        culturalSuitabilityEvaluationModel.criteriaId = catalogItem.item_id;
                        culturalSuitabilityEvaluationModel.criteriaName = catalogItem.name;
                        culturalSuitabilityEvaluationModel.type = CATALOG_ITEM.CULTURAL_SUITABILITY;
                        culturalSuitabilityEvaluationModel.evaluation = "";
                        culturalSuitabilityEvaluationModel.criteria = catalogItem;
                        culturalSuitabilityEvaluationModels.push(culturalSuitabilityEvaluationModel);
                        this.onAddCulturalSuitabilityEvaluation(culturalSuitabilityEvaluationFroms, culturalSuitabilityEvaluationModel);
                    }
                }

            }
        });
    }

    onAddCulturalSuitabilityEvaluation(culturalSuitabilityEvaluationFroms: FormControl[], model: EvaluationCriteriaModel) {
        let culturalSuitabilityEvaluationForm: FormControl = new FormControl();
        culturalSuitabilityEvaluationForm.setValue(model.evaluation);
        culturalSuitabilityEvaluationFroms.push(culturalSuitabilityEvaluationForm);
        // disable if not hrlead and not
        if (!this.isHrJoinInterview) {
            culturalSuitabilityEvaluationForm.disable();
        }
    }

    checkIsHrJoinInterview(): boolean {
        if (!this.interviewSchedules || this.interviewSchedules.length == 0) {
            return false;
        }
        const currentUser = this.userStorage.getUserInfo();
        const interviewSchedule = this.interviewSchedules[this.interviewSchedules.length - 1];
        this.isHrJoinInterview = interviewSchedule.hrInfo.user_code == currentUser.userCode;
    }

    openAddNewCulturalSuitabilityEvaluation(index: number): void {
        this.countOpenPopupEvaluationCriteria++;
        if (this.countOpenPopupEvaluationCriteria == 1) {
            this.modalRef = this.modalService.show(DialogAddEvaluationCriteriaComponent, {
                initialState: {
                    catalogCode: CATALOG_ITEM.CULTURAL_SUITABILITY,
                    titleAddEvaluationCriteria: this.translate.instant('recruitment.interview.cultural_suitability')
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            });

            if (this.modalRef) {
                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaSuccess.subscribe((res: CatalogItemModel) => {
                    if (res.item_id > 0) {
                        const existed = this.culturalSuitabilityEvaluationModelEs[index].some(el => el.criteriaId == res.item_id);
                        if (existed) {
                            this.toastMessage.showMessageError('DUPLICATE_CRITERIA', this.translate.instant('candidate.interview.evaluation_criteria_already_exist'), '')
                            return;
                        }
                        let culturalSuitabilityEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        culturalSuitabilityEvaluationModel.criteriaId = res.item_id;
                        culturalSuitabilityEvaluationModel.criteriaName = res.name;
                        culturalSuitabilityEvaluationModel.type = CATALOG_ITEM.CULTURAL_SUITABILITY;
                        culturalSuitabilityEvaluationModel.evaluation = "";
                        this.culturalSuitabilityEvaluationModelEs[index].push(culturalSuitabilityEvaluationModel);
                        this.onAddCulturalSuitabilityEvaluation(this.culturalSuitabilityEvaluationFormEs[index], culturalSuitabilityEvaluationModel);
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });

                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaHide.subscribe((res: boolean) => {
                    if (res) {
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });
            }
        }
    }

    initIncomeEvaluation(): void {
        let incomeEvaluationModels: EvaluationCriteriaModel[] = [];
        let incomeEvaluationFroms: FormControl[] = [];
        this.incomeEvaluationModelEs.push(incomeEvaluationModels);
        this.incomeEvaluationFormEs.push(incomeEvaluationFroms);
        this.catalogItemService.getItems(CATALOG_ITEM.INCOME).subscribe(data => {
            if (data.status.success) {
                let catalogItems: CatalogItemModel[] = data.data;
                for (let catalogItem of catalogItems) {
                    if (catalogItem.is_default) {
                        let incomeEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        incomeEvaluationModel.criteriaId = catalogItem.item_id;
                        incomeEvaluationModel.criteriaName = catalogItem.name;
                        incomeEvaluationModel.type = CATALOG_ITEM.INCOME;
                        incomeEvaluationModel.evaluation = "";
                        incomeEvaluationModels.push(incomeEvaluationModel);
                        this.onAddIncomeEvaluation(incomeEvaluationFroms, incomeEvaluationModel);
                    }
                }

            }
        });
    }

    onAddIncomeEvaluation(incomeEvaluationFroms: FormControl[], model: EvaluationCriteriaModel) {
        let incomeEvaluationForm: FormControl = new FormControl();
        incomeEvaluationForm.setValue(model.evaluation);
        incomeEvaluationFroms.push(incomeEvaluationForm);
        if (!this.isHrJoinInterview) {
            incomeEvaluationForm.disable();
        }
    }

    initCommonInfomationEvaluation(): void {
        let commonInfomationEvaluationModels: EvaluationCriteriaModel[] = [];
        let commonInfomationEvaluationFroms: FormControl[] = [];
        this.commonInfomationEvaluationModelEs.push(commonInfomationEvaluationModels);
        this.commonInfomationEvaluationFormEs.push(commonInfomationEvaluationFroms);

        this.catalogItemService.getItems(CATALOG_ITEM.COMMON_INFOMATION).subscribe(data => {
            if (data.status.success) {
                let catalogItems: CatalogItemModel[] = data.data;
                for (let catalogItem of catalogItems) {
                    if (catalogItem.is_default) {
                        let commonInfomationEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        commonInfomationEvaluationModel.criteriaId = catalogItem.item_id;
                        commonInfomationEvaluationModel.criteriaName = catalogItem.name;
                        commonInfomationEvaluationModel.type = CATALOG_ITEM.COMMON_INFOMATION;
                        commonInfomationEvaluationModel.evaluation = "";
                        commonInfomationEvaluationModel.disable = true;
                        commonInfomationEvaluationModels.push(commonInfomationEvaluationModel);
                        this.onAddCommonInfomationEvaluation(commonInfomationEvaluationFroms, commonInfomationEvaluationModel);
                    }
                }

            }
        });
    }

    onAddCommonInfomationEvaluation(commonInfomationEvaluationFroms: FormControl[], model: EvaluationCriteriaModel) {
        let commonInfomationEvaluationForm: FormControl = new FormControl();
        commonInfomationEvaluationForm.setValue(model.evaluation);
        commonInfomationEvaluationFroms.push(commonInfomationEvaluationForm);
        if (!this.isHrJoinInterview) {
            commonInfomationEvaluationForm.disable();
        }
    }


    openAddNewCommonInfomationEvaluation(index: number): void {
        this.countOpenPopupEvaluationCriteria++;
        if (this.countOpenPopupEvaluationCriteria == 1) {
            this.modalRef = this.modalService.show(DialogAddEvaluationCriteriaComponent, {
                initialState: {
                    catalogCode: CATALOG_ITEM.COMMON_INFOMATION,
                    titleAddEvaluationCriteria: this.translate.instant('recruitment.interview.common_infomation')
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            });

            if (this.modalRef) {
                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaSuccess.subscribe((res: CatalogItemModel) => {
                    if (res.item_id > 0) {
                        const existed = this.commonInfomationEvaluationModelEs[index].some(el => el.criteriaId == res.item_id);
                        if (existed) {
                            this.toastMessage.showMessageError('DUPLICATE_CRITERIA', this.translate.instant('candidate.interview.evaluation_criteria_already_exist'), '');
                            return;
                        }
                        let commonInfomationEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        commonInfomationEvaluationModel.criteriaId = res.item_id;
                        commonInfomationEvaluationModel.criteriaName = res.name;
                        commonInfomationEvaluationModel.type = CATALOG_ITEM.COMMON_INFOMATION;
                        commonInfomationEvaluationModel.evaluation = "";
                        this.commonInfomationEvaluationModelEs[index].push(commonInfomationEvaluationModel);
                        this.onAddCommonInfomationEvaluation(this.commonInfomationEvaluationFormEs[index], commonInfomationEvaluationModel);
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });

                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaHide.subscribe((res: boolean) => {
                    if (res) {
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });
            }
        }
    }

    initOtherEvaluation(): void {
        let otherEvaluationModels: EvaluationCriteriaModel[] = [];
        let otherEvaluationFroms: FormControl[] = [];
        this.otherEvaluationModelEs.push(otherEvaluationModels);
        this.otherEvaluationFormEs.push(otherEvaluationFroms);

        this.catalogItemService.getItems(CATALOG_ITEM.OTHER_EVALUATION).subscribe(data => {
            if (data.status.success) {
                let catalogItems: CatalogItemModel[] = data.data;
                for (let catalogItem of catalogItems) {
                    if (catalogItem.is_default) {
                        let otherEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        otherEvaluationModel.criteriaId = catalogItem.item_id;
                        otherEvaluationModel.criteriaName = catalogItem.name;
                        otherEvaluationModel.type = CATALOG_ITEM.OTHER_EVALUATION;
                        otherEvaluationModel.evaluation = "";
                        otherEvaluationModels.push(otherEvaluationModel);
                        this.onAddOtherEvaluation(otherEvaluationFroms, otherEvaluationModel);
                    }
                }

            }
        });
    }

    onAddOtherEvaluation(otherEvaluationFroms: FormControl[], model: EvaluationCriteriaModel): void {
        let otherEvaluationForm: FormControl = new FormControl();
        otherEvaluationForm.setValue(model.evaluation);
        otherEvaluationFroms.push(otherEvaluationForm);
    }

    openAddNewOtherEvaluation(index: number): void {
        this.countOpenPopupEvaluationCriteria++;
        if (this.countOpenPopupEvaluationCriteria == 1) {
            this.modalRef = this.modalService.show(DialogAddEvaluationCriteriaComponent, {
                initialState: {
                    catalogCode: CATALOG_ITEM.OTHER_EVALUATION,
                    titleAddEvaluationCriteria: this.translate.instant('recruitment.interview.other_evaluation')
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            });

            if (this.modalRef) {
                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaSuccess.subscribe((res: CatalogItemModel) => {
                    if (res.item_id > 0) {
                        const existed = this.otherEvaluationModelEs[index].some(el => el.criteriaId = res.item_id);
                        if (existed) {
                            this.toastMessage.showMessageError('DUPLICATE_CRITERIA', this.translate.instant('candidate.interview.evaluation_criteria_already_exist'), '');
                            return;
                        }
                        let otherEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        otherEvaluationModel.criteriaId = res.item_id;
                        otherEvaluationModel.criteriaName = res.name;
                        otherEvaluationModel.type = CATALOG_ITEM.OTHER_EVALUATION;
                        otherEvaluationModel.evaluation = "";
                        this.otherEvaluationModelEs[index].push(otherEvaluationModel);
                        this.onAddOtherEvaluation(this.otherEvaluationFormEs[index], otherEvaluationModel);
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });

                (<DialogAddEvaluationCriteriaComponent>this.modalRef.content).addEvaluationCriteriaHide.subscribe((res: boolean) => {
                    if (res) {
                        this.countOpenPopupEvaluationCriteria = 0;
                    }
                });
            }
        }
    }

    makeRecruitmentProposal(index: number) {
        let model: RecruitmentProposalModel = new RecruitmentProposalModel();
        model.candidateId = this.candidateInfo.candidate_id;
        model.netSalary = this.recruitmentProposalModelEs[index].netSalary;
        model.applyPositionId = this.recruitmentProposalModelEs[index].applyPositionId;
        model.teamId = this.recruitmentProposalModelEs[index].teamId;
        model.productivity = this.recruitmentProposalModelEs[index].productivity;
        model.project = this.recruitmentProposalModelEs[index].project;
        model.hrNote = this.recruitmentProposalModelEs[index].hrNote;
        model.hrLeadNote = this.recruitmentProposalModelEs[index].hrLeadNote;
        model.bodNote = this.recruitmentProposalModelEs[index].bodNote;
        model.id = this.recruitmentProposalModelEs[index].id;
        this.recruitmentService.createRecruitmentProposal(model).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.create_recruitment_proposal_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                // this.detailComponent.getCandidateDetail();
                // this.initByDetailInterviewScheduleTab();
                this.detailComponent.resetTab();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    rejectRecruitmentProposal(index: number) {
        const proposal: RecruitmentProposalModel = this.recruitmentProposalModelEs[index];
        const waitingApproval = proposal?.status?.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD;
        let model: RejectApprovalProposalModel = new RejectApprovalProposalModel();
        model.id = this.recruitmentProposalModelEs[index].id;
        model.note = waitingApproval ? proposal.hrLeadNote : proposal.bodNote;
        model.approval = false;
        this.recruitmentService.rejectApprovalProposal(model).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.reject_recruitment_proposal_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                // this.detailComponent.getCandidateDetail();
                // this.initByDetailInterviewScheduleTab();
                this.detailComponent.resetTab();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    approveRecruitmentProposal(index: number) {
        const proposal: RecruitmentProposalModel = this.recruitmentProposalModelEs[index];
        const waitingApproval = this.proposals[index]?.status?.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD;
        let model: RejectApprovalProposalModel = new RejectApprovalProposalModel();
        model.id = this.recruitmentProposalModelEs[index].id;
        model.note = waitingApproval ? proposal.hrLeadNote : proposal.bodNote;
        model.approval = true;
        this.recruitmentService.rejectApprovalProposal(model).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.approve_recruitment_proposal_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                // this.detailComponent.getCandidateDetail();
                // this.initByDetailInterviewScheduleTab();
                this.detailComponent.resetTab();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    onInitCandidateApplyPositionDefault() {
        this.catalogItemService.getItems(CATALOG_ITEM.APPLY_POSITION).subscribe(data => {
            if (data.status.success) {
                this.catalogItemApplyPosition = data.data;
            }
        });
    }

    onInitCandidateApplyPosition(applyPositionField: FormlyFieldConfig) {
        let dataOptions: any[] = [];
        for (var item of this.catalogItemApplyPosition) {
            let optionStatus: any = {
                value: item.item_id,
                label: item.name
            }
            dataOptions.push(optionStatus);
        }
        applyPositionField.templateOptions.options = dataOptions;
    }


    onInitTeamAssign(teamAssignField: FormlyFieldConfig) {
        this.teamService.getTeams().subscribe(data => {
            let dataOptions: any[] = [];
            for (var item of data.data) {
                let optionTeam: any = {
                    value: item.id,
                    label: item.teamName
                }
                dataOptions.push(optionTeam);
            }
            teamAssignField.templateOptions.options = dataOptions;
        });
    }

    onInitCandidateSpecializeLevelDefault() {
        this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_LEVEL).subscribe(data => {
            if (data.status.success) {
                this.catalogItemSpecializeLevel = data.data;
            }
        });
    }

    onInitCandidateSpecializeLevel(specializeLevelField: FormlyFieldConfig) {
        let dataOptions: any[] = [];
        for (var item of this.catalogItemSpecializeLevel) {
            let optionStatus: any = {
                value: item.item_id,
                label: item.name
            }
            dataOptions.push(optionStatus);
        }
        specializeLevelField.templateOptions.options = dataOptions;
    }

    initByDetailInterviewScheduleTab(): void {
        this.recruitmentService.getInterviewInfo(this.candidateInfo.candidate_id).pipe(
            take(1)
        ).subscribe(data => {
            if (data.status && data.status.success) {
                if (data.data.interviewSchedules) {
                    this.interviewSchedules = data.data.interviewSchedules;
                    this.candidateViewAddNewScheduleInterview = this.checkViewAddNewScheduleInterview();
                    this.isPassInterview = this.checkIsPassInterview();
                    for (let interviewSchedule of this.interviewSchedules) {
                        this.initAndAddPreInterviewAssessmentFields(interviewSchedule);
                    }
                }
                if (data.data.proposals) {
                    this.proposals = data.data.proposals;
                }
                this.checkIsInterviewer();
                this.checkIsHrJoinInterview();
                this.checkHasInterviewResultHr();
                this.initByLoadingRecruitmentProposal();
            }
        })
    }

    saveInterviewEvaluationInterview(index: number): void {
        let interviewEvaluationModel: InterviewEvaluationModel = new InterviewEvaluationModel();
        interviewEvaluationModel.candidateId = this.candidateInfo.candidate_id;
        interviewEvaluationModel.type = CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.INTERVIEWER;
        interviewEvaluationModel.levelId = this.interviewResultModelEs[index].levelId;
        interviewEvaluationModel.workAbility = this.interviewResultModelEs[index].possibilityToContribute;
        interviewEvaluationModel.jobSuitability = this.interviewResultModelEs[index].suitableForProject;
        interviewEvaluationModel.decision = this.interviewResultModelEs[index].decision;
        interviewEvaluationModel.id = this.interviewResultModelEs[index].id;
        let evaluationCriterias: EvaluationCriteriaModel[] = [];
        for (let i = 0; i < this.profestionalEvaluationModelEs[index].length; i++) {
            let evaluationCriteriaModel: EvaluationCriteriaModel = this.profestionalEvaluationModelEs[index][i];
            evaluationCriteriaModel.evaluation = this.profestionalEvaluationFormEs[index][i].value;
            evaluationCriterias.push(evaluationCriteriaModel);
        }
        interviewEvaluationModel.evaluationCriterias = evaluationCriterias;
        this.recruitmentService.interviewEvaluation(interviewEvaluationModel).subscribe(response => {
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_evaluation_success'),
                this.translate.instant('shared.common-dialog.info.title'));
            this.detailComponent.getCandidateDetail();
            this.initByDetailInterviewScheduleTab();
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }


    saveInterviewEvaluationHR(index: number): void {
        let interviewEvaluationModel: InterviewEvaluationModel = new InterviewEvaluationModel();
        interviewEvaluationModel.candidateId = this.candidateInfo.candidate_id;
        interviewEvaluationModel.type = CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.HR;
        interviewEvaluationModel.workAbility = this.interviewResultHRModelEs[index].possibilityToContribute;
        interviewEvaluationModel.jobSuitability = this.interviewResultHRModelEs[index].suitableForProject;
        interviewEvaluationModel.decision = this.interviewResultHRModelEs[index].decision;
        interviewEvaluationModel.longTermCommitment = this.interviewResultHRModelEs[index].longTermCommitment;
        interviewEvaluationModel.salary = this.interviewResultHRModelEs[index].salary;
        interviewEvaluationModel.teamworkAbility = this.interviewResultHRModelEs[index].teamworkAbility;
        interviewEvaluationModel.id = this.interviewResultHRModelEs[index].id;

        let evaluationCriterias: EvaluationCriteriaModel[] = [];
        for (let i = 0; i < this.culturalSuitabilityEvaluationModelEs[index].length; i++) {
            let evaluationCriteriaModel: EvaluationCriteriaModel = this.culturalSuitabilityEvaluationModelEs[index][i];
            evaluationCriteriaModel.evaluation = this.culturalSuitabilityEvaluationFormEs[index][i].value;
            evaluationCriterias.push(evaluationCriteriaModel);
        }

        for (let i = 0; i < this.incomeEvaluationModelEs[index].length; i++) {
            let evaluationCriteriaModel: EvaluationCriteriaModel = this.incomeEvaluationModelEs[index][i];
            evaluationCriteriaModel.evaluation = this.incomeEvaluationFormEs[index][i].value;
            evaluationCriterias.push(evaluationCriteriaModel);
        }

        for (let i = 0; i < this.commonInfomationEvaluationModelEs[index].length; i++) {
            let evaluationCriteriaModel: EvaluationCriteriaModel = this.commonInfomationEvaluationModelEs[index][i];
            evaluationCriteriaModel.evaluation = this.commonInfomationEvaluationFormEs[index][i].value;
            evaluationCriterias.push(evaluationCriteriaModel);
        }

        for (let i = 0; i < this.otherEvaluationModelEs[index].length; i++) {
            let evaluationCriteriaModel: EvaluationCriteriaModel = this.otherEvaluationModelEs[index][i];
            evaluationCriteriaModel.evaluation = this.otherEvaluationFormEs[index][i].value;
            evaluationCriterias.push(evaluationCriteriaModel);
        }
        interviewEvaluationModel.evaluationCriterias = evaluationCriterias;
        this.recruitmentService.interviewEvaluation(interviewEvaluationModel).subscribe(response => {
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_hr_evaluation_success'),
                this.translate.instant('shared.common-dialog.info.title'));
            this.initByDetailInterviewScheduleTab();
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }


    onInitInterviewPlace() {
        this.catalogItemService.getItems(CATALOG_ITEM.INTERVIEW_PLACE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemInterviewPlace = data.data;
            }
        });
    }

    getInterviewPlace(placeId: number): string {
        for (let interviewPlace of this.catalogItemInterviewPlace) {
            if (interviewPlace.item_id == placeId) {
                return interviewPlace.name;
            }
        }
        return '';
    }

    getDisplayInterviewTime(from: string, to: string): string {
        if (!from || !to) {
            return '';
        }
        const momentFrom = moment(from, 'YYYY-MM-DD[T]HH:mm:ss[Z]');
        const momentTo = moment(to, 'YYYY-MM-DD[T]HH:mm:ss[Z]');
        return momentFrom.format('DD/MM/YYYY HH:mm') + ' - ' + momentTo.format('HH:mm')
    }

    initAndAddPreInterviewAssessmentFields(model: InterviewScheduleModel) {
        this.checkIsInterviewer();
        this.checkIsHrJoinInterview();
        this.checkHasInterviewResultHr();
        this.checkCanEditSchedule();
        const canEditPreInterview = this.canEditSchedule || this.isInchargeHr;
        const scheduleExpired = model.isJoined == false || model.interviewResults?.length > 0;
        let currentSalaryField: FormlyFieldConfig = {
            type: 'currency',
            key: 'currentSalary',
            className: 'col-3',
            focus: false,
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.current_salary'),
                placeholder: this.translate.instant('candidate.interview.enter_your_current_salary'),
                autoFocus: false,
                required: false,
                disabled: !canEditPreInterview || scheduleExpired,
                pattern: /^[0-9]*$/,
            },
            validation: {
                messages: {
                    pattern: (error: any, field: FormlyFieldConfig) => this.translate.instant('candidate.interview.error_current_salary'),
                },
            },
            defaultValue: null
        }

        let expectSalaryField: FormlyFieldConfig = {
            type: 'currency',
            key: 'expectSalary',
            className: 'col-3',
            focus: false,
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.desired_salary'),
                placeholder: this.translate.instant('candidate.interview.enter_desired_salary'),
                autoFocus: false,
                required: false,
                disabled: !canEditPreInterview || scheduleExpired,
                pattern: /^[0-9]*$/,
            },
            validation: {
                messages: {
                    pattern: (error: any, field: FormlyFieldConfig) => this.translate.instant('candidate.interview.err_desired_salary') ,
                },
            },
            defaultValue: null
        }

        let onboardTimeField: FormlyFieldConfig = {
            type: 'date',
            key: 'onboardTime',
            className: 'col-3',
            defaultValue: null,
            templateOptions: {
                label: this.translate.instant('candidate.interview.day_can_go_to_work'),
                placeholder: 'DD/MM/YYYY',
                nextMonth: false,
                disabled: !canEditPreInterview || scheduleExpired,
                minDate: moment().format('DD/MM/YYYY')
            }
        }

        let noteField: FormlyFieldConfig = {
            key: 'note',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.assign.note'),
                placeholder: this.translate.instant('candidate.assign.enter_note'),
                rows: 3,
                required: false,
                maxLength: 1000,
                disabled: !canEditPreInterview || scheduleExpired
            }
        }

        let isJoinedField: FormlyFieldConfig = {
            key: 'isJoined',
            type: 'radio',
            className: '',
            templateOptions: {
                label: this.translate.instant('candidate.interview.candidate_come_interview'),
                required: true,
                display: 'horizontal-inline',
                options: [
                    {value: true, label: this.translate.instant('candidate.interview.yes')},
                    {value: false, label: this.translate.instant('candidate.interview.no')}
                ],
                disabled: !canEditPreInterview || scheduleExpired
            },
            defaultValue: null
        };

        let preInterviewAssessmentFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'mt-3 m-l-5 row',
                fieldGroup: [
                    currentSalaryField,
                    expectSalaryField,
                    onboardTimeField,
                    noteField,
                    isJoinedField
                ]
            }
        ];

        let preInterviewAssessmentModel: any = model;
        preInterviewAssessmentModel.onboardTime = DateTimeUtils.parser(model.onboardTime, 'YYYY-MM-DD');

        this.preInterviewAssessmentFieldEs.push(preInterviewAssessmentFields);
        this.preInterviewAssessmentForms.push(new FormGroup({}));
        this.preInterviewAssessmentModels.push(preInterviewAssessmentModel);

        this.initByLoadingProfestionalEvaluation(model);
        this.initByLoadingCulturalSuitabilityEvaluation(model);
    }

    checkIsLoadingEvaluation(model: InterviewScheduleModel, type: string): boolean {
        let isLoading: boolean = false;
        for (let interviewResult of model.interviewResults) {
            if (interviewResult.type == type) {
                isLoading = true;
            }
        }
        return isLoading;
    }

    checkIsLoadingRecruitmentProposal(): boolean {
        let isLoading: boolean = false;
        for (let proposal of this.proposals) {
            isLoading = true;
        }
        return isLoading;
    }

    initByLoadingProfestionalEvaluation(model: InterviewScheduleModel) {
        const hasInterviewerResult = model.interviewResults
            .some(rs => rs.type == CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.INTERVIEWER);
        if (!hasInterviewerResult) {
            this.initProfestionalEvaluation();
            this.initInterviewResultField(new InterviewEvaluationModel());
            this.inteviewEvaluationNotExists.push(false);
            return;
            this.initInterviewResultField(new InterviewEvaluationModel());
            return;
        }

        let profestionalEvaluationModels: EvaluationCriteriaModel[] = [];
        let profestionalEvaluationForms: FormControl[] = [];
        this.profestionalEvaluationModelEs.push(profestionalEvaluationModels);
        this.profestionalEvaluationFormEs.push(profestionalEvaluationForms);

        for (let interviewResult of model.interviewResults) {
            if (interviewResult.type == CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.INTERVIEWER) {
                this.initInterviewResultField(interviewResult);
                for (let evaluationCriteria of interviewResult.evaluationCriterias) {
                    if (evaluationCriteria.type == CATALOG_ITEM.PROFESTIONAL_EVALUATION) {
                        let professionalAssessmentResult: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        professionalAssessmentResult.criteriaId = evaluationCriteria.criteria.item_id;
                        professionalAssessmentResult.criteriaName = evaluationCriteria.criteria.name;
                        professionalAssessmentResult.type = CATALOG_ITEM.PROFESTIONAL_EVALUATION;
                        professionalAssessmentResult.evaluation = evaluationCriteria.evaluation;
                        professionalAssessmentResult.disable == !(model.interviewerInfo.findIndex(e => e.employeeCode == this.userStorage.getUserInfo().userCode) > -1 ? true : false) || (!this.proposals || this.proposals.length === 0);
                        profestionalEvaluationModels.push(professionalAssessmentResult);
                        this.onAddProfessionalAssessment(profestionalEvaluationForms, professionalAssessmentResult);
                    }
                }
            }
        }
    }

    initByLoadingCulturalSuitabilityEvaluation(model: InterviewScheduleModel) {
        if (!this.checkIsLoadingEvaluation(model, CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.HR)) {
            this.initCulturalSuitabilityEvaluation();
            this.initIncomeEvaluation();
            this.initCommonInfomationEvaluation();
            this.initOtherEvaluation();
            this.initInterviewResultHRField(new InterviewEvaluationModel());
            return;
        }

        let culturalSuitabilityEvaluationModels: EvaluationCriteriaModel[] = [];
        let culturalSuitabilityEvaluationFroms: FormControl[] = [];
        this.culturalSuitabilityEvaluationModelEs.push(culturalSuitabilityEvaluationModels);
        this.culturalSuitabilityEvaluationFormEs.push(culturalSuitabilityEvaluationFroms);

        let incomeEvaluationModels: EvaluationCriteriaModel[] = [];
        let incomeEvaluationFroms: FormControl[] = [];
        this.incomeEvaluationModelEs.push(incomeEvaluationModels);
        this.incomeEvaluationFormEs.push(incomeEvaluationFroms);

        let commonInfomationEvaluationModels: EvaluationCriteriaModel[] = [];
        let commonInfomationEvaluationFroms: FormControl[] = [];
        this.commonInfomationEvaluationModelEs.push(commonInfomationEvaluationModels);
        this.commonInfomationEvaluationFormEs.push(commonInfomationEvaluationFroms);

        let otherEvaluationModels: EvaluationCriteriaModel[] = [];
        let otherEvaluationFroms: FormControl[] = [];
        this.otherEvaluationModelEs.push(otherEvaluationModels);
        this.otherEvaluationFormEs.push(otherEvaluationFroms);

        for (let interviewResult of model.interviewResults) {
            if (interviewResult.type == CONFIG.RECRUITMENT.INTERVIEW_EVALUATION.TYPE.HR) {
                this.initInterviewResultHRField(interviewResult);
                for (let evaluationCriteria of interviewResult.evaluationCriterias) {
                    if (evaluationCriteria.type == CATALOG_ITEM.CULTURAL_SUITABILITY) {
                        let culturalSuitabilityEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        culturalSuitabilityEvaluationModel.criteriaId = evaluationCriteria.criteria.item_id;
                        culturalSuitabilityEvaluationModel.criteriaName = evaluationCriteria.criteria.name;
                        culturalSuitabilityEvaluationModel.type = evaluationCriteria.type;
                        culturalSuitabilityEvaluationModel.evaluation = evaluationCriteria.evaluation;
                        culturalSuitabilityEvaluationModel.disable = true;
                        culturalSuitabilityEvaluationModels.push(culturalSuitabilityEvaluationModel);
                        this.onAddCulturalSuitabilityEvaluation(culturalSuitabilityEvaluationFroms, culturalSuitabilityEvaluationModel);
                    }

                    if (evaluationCriteria.type == CATALOG_ITEM.INCOME) {
                        let incomeEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        incomeEvaluationModel.criteriaId = evaluationCriteria.criteria.item_id;
                        incomeEvaluationModel.criteriaName = evaluationCriteria.criteria.name;
                        incomeEvaluationModel.type = evaluationCriteria.type;
                        incomeEvaluationModel.evaluation = evaluationCriteria.evaluation;
                        incomeEvaluationModels.push(incomeEvaluationModel);
                        this.onAddIncomeEvaluation(incomeEvaluationFroms, incomeEvaluationModel);
                    }

                    if (evaluationCriteria.type == CATALOG_ITEM.COMMON_INFOMATION) {
                        let commonInfomationEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        commonInfomationEvaluationModel.criteriaId = evaluationCriteria.criteria.item_id;
                        commonInfomationEvaluationModel.criteriaName = evaluationCriteria.criteria.name;
                        commonInfomationEvaluationModel.type = evaluationCriteria.type;
                        commonInfomationEvaluationModel.evaluation = evaluationCriteria.evaluation;
                        commonInfomationEvaluationModels.push(commonInfomationEvaluationModel);
                        this.onAddCommonInfomationEvaluation(commonInfomationEvaluationFroms, commonInfomationEvaluationModel);
                    }

                    if (evaluationCriteria.type == CATALOG_ITEM.OTHER_EVALUATION) {
                        let otherEvaluationModel: EvaluationCriteriaModel = new EvaluationCriteriaModel();
                        otherEvaluationModel.criteriaId = evaluationCriteria.criteria.item_id;
                        otherEvaluationModel.criteriaName = evaluationCriteria.criteria.name;
                        otherEvaluationModel.type = evaluationCriteria.type;
                        otherEvaluationModel.evaluation = evaluationCriteria.evaluation;
                        otherEvaluationModels.push(otherEvaluationModel);
                        this.onAddOtherEvaluation(otherEvaluationFroms, otherEvaluationModel);
                    }
                }
            }
        }
    }

    initInterviewResultField(model: InterviewEvaluationModel) {
        let specializeLevelField: FormlyFieldConfig = {
            key: 'levelId',
            type: 'radio',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.expertise_level'),
                required: true,
                display: 'horizontal-inline',
                disabled: !this.isInterviewer
            },
            defaultValue: null
        };

        let possibilityToContributeField: FormlyFieldConfig = {
            key: 'possibilityToContribute',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: '2.' + this.translate.instant('candidate.interview.possibility_to_contribute'),
                customLabel: this.translate.instant('candidate.interview.possibility_to_contribute'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: true,
                maxLength: 1000,
                disabled: !this.isInterviewer,
                blur: (field, event) => {
                    field.formControl.setValue((field.formControl.value as string)?.trim())
                }
            }
        }

        let suitableForProjectField: FormlyFieldConfig = {
            key: 'suitableForProject',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: '3. '+ this.translate.instant('candidate.interview.suitable_for'),
                customLabel: this.translate.instant('candidate.interview.suitable_for'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: true,
                maxLength: 1000,
                disabled: !this.isInterviewer,
                blur: (field) => {
                    field.formControl.setValue((field.formControl.value as string)?.trim())
                }
            }
        }

        let decisionField: FormlyFieldConfig = {
            key: 'decision',
            type: 'radio',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.offer'),
                required: true,
                display: 'horizontal-inline',
                options: [
                    {value: true, label: this.translate.instant('candidate.interview.recruit')},
                    {value: false, label: this.translate.instant('candidate.interview.no_recruit')}
                ],
                disabled: !this.isInterviewer
            },
            defaultValue: false
        };

        let interviewResultFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: [
                    specializeLevelField,
                    possibilityToContributeField,
                    suitableForProjectField,
                    decisionField
                ]
            }
        ];

        this.interviewResultFieldEs.push(interviewResultFields);
        this.interviewResultFormEs.push(new FormGroup({}));

        let interviewResultModel: any = {};
        interviewResultModel.suitableForProject = model.jobSuitability;
        interviewResultModel.possibilityToContribute = model.workAbility;
        interviewResultModel.decision = model.decision;
        interviewResultModel.levelId = model.levelId;
        interviewResultModel.id = model.id;
        this.interviewResultModelEs.push(interviewResultModel);
        this.onInitCandidateSpecializeLevel(specializeLevelField);
    }

    initInterviewResultHRField(model: InterviewEvaluationModel): void {
        let teamworkAbilityField: FormlyFieldConfig = {
            key: 'teamworkAbility',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: '1. '+ this.translate.instant('candidate.interview.communicate_collaborate'),
                customLabel: this.translate.instant('candidate.interview.communicate_collaborate'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: true,
                disabled: !this.isHrJoinInterview,
                maxLength: 1000,
                blur: (field) => {
                    field.formControl.setValue((field.formControl.value as string || '').trim())
                }
            }
        }

        let salaryField: FormlyFieldConfig = {
            key: 'salary',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: '2. '+ this.translate.instant('candidate.interview.income'),
                customLabel: this.translate.instant('candidate.interview.income'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: true,
                disabled: !this.isHrJoinInterview
            }
        }

        let longTermCommitmentField: FormlyFieldConfig = {
            key: 'longTermCommitment',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: '3. '+ this.translate.instant('candidate.interview.ability_to_stick'),
                customLabel: this.translate.instant('candidate.interview.ability_to_stick'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: true,
                disabled: !this.isHrJoinInterview
            }
        }

        let decisionField: FormlyFieldConfig = {
            key: 'decision',
            type: 'radio',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.offer'),
                required: true,
                display: 'horizontal-inline',
                disabled: !this.isHrJoinInterview,
                options: [
                    {value: true, label: this.translate.instant('candidate.interview.recruit')},
                    {value: false, label: this.translate.instant('candidate.interview.no_recruit')}
                ],
            },
            defaultValue: false
        };

        let interviewResultHRFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: [
                    teamworkAbilityField,
                    salaryField,
                    longTermCommitmentField,
                    decisionField
                ]
            }
        ];

        this.interviewResultHRFieldEs.push(interviewResultHRFields);
        this.interviewResultHRFormEs.push(new FormGroup({}));

        let interviewResultHRModel: any = {};
        interviewResultHRModel.teamworkAbility = model.teamworkAbility;
        interviewResultHRModel.longTermCommitment = model.longTermCommitment;
        interviewResultHRModel.salary = model.salary;
        interviewResultHRModel.decision = model.decision;
        interviewResultHRModel.id = model.id;
        this.interviewResultHRModelEs.push(interviewResultHRModel);
    }

    initByLoadingRecruitmentProposal(): void {
        if (!this.checkIsLoadingRecruitmentProposal()) {
            this.initRecruitmentProposalField(new RecruitmentProposalModel());
            return;
        }
        for (let proposal of this.proposals) {
            this.initRecruitmentProposalField(proposal);
        }
    }

    initRecruitmentProposalField(model: RecruitmentProposalModel): void {
        const canEdit = this.userStorage.existPermission('edit_recruitment_proposal') || this.isInchargeHr;
        const waitingApproval = !model.status || model?.status?.code == RECRUITMENT_PROPOSAL_STATUS.WAITING_HR_LEAD;
        const hrLeadComplete = [RECRUITMENT_PROPOSAL_STATUS.HR_LEAD_APPROVED, RECRUITMENT_PROPOSAL_STATUS.HR_LEAD_REJECT].some(
            stt => stt == model?.status?.code
        )
        const bodComplete = [RECRUITMENT_PROPOSAL_STATUS.BOD_APPROVED, RECRUITMENT_PROPOSAL_STATUS.BOD_REJECT].some(
            stt => stt == model?.status?.code
        );
        let netSalaryField: FormlyFieldConfig = {
            key: 'netSalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.salary_net'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: !canEdit || !waitingApproval
            }
        }

        let applyPositionField: FormlyFieldConfig = {
            type: 'select',
            key: 'applyPositionId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: this.translate.instant('candidate.model.apply_position'),
                noSelectText: this.translate.instant('candidate.model.apply_position_placeholder'),
                autoFocus: false,
                required: true,
                disabled: !canEdit || !waitingApproval
            },
            defaultValue: null
        }

        let teamAssignField: FormlyFieldConfig = {
            type: 'select',
            key: 'teamId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: 'Team',
                noSelectText: this.translate.instant('candidate.interview.enter_team'),
                autoFocus: false,
                required: true,
                disabled: !canEdit || !waitingApproval
            },
            defaultValue: null
        }

        let productivityField: FormlyFieldConfig = {
            key: 'productivity',
            type: 'input',
            className: 'col-3',
            templateOptions: {
                label: this.translate.instant('candidate.interview.productivity_level'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                required: true,
                disabled: !canEdit || !waitingApproval
            }
        }

        let projectField: FormlyFieldConfig = {
            key: 'project',
            type: 'input',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.project'),
                placeholder: this.translate.instant('candidate.interview.enter_project'),
                required: true,
                disabled: !canEdit || !waitingApproval
            }
        };

        let hrNoteField: FormlyFieldConfig = {
            key: 'hrNote',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.note_from_hr'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: false,
                disabled: !this.isInchargeHr || !waitingApproval
            }
        }

        let hrLeadNoteField: FormlyFieldConfig = {
            key: 'hrLeadNote',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.note_from_hr_lead'),
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: false,
                disabled: !canEdit || hrLeadComplete || bodComplete
            }
        }

        let bodNoteField: FormlyFieldConfig = {
            key: 'bodNote',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.note_bod') ,
                placeholder: this.translate.instant('candidate.interview.enter_results'),
                rows: 3,
                required: false,
                disabled: !canEdit || bodComplete
            }
        }

        let fieldGroupProposalFields: FormlyFieldConfig[] = [
            netSalaryField,
            applyPositionField,
            teamAssignField,
            productivityField,
            projectField,
            hrNoteField
        ];

        let recruitmentProposalFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: fieldGroupProposalFields
            }
        ];

        if (bodComplete || (this.checkApproveRecruitmentProposalHRALead() && this.checkStatusRecruitmentProposalApproveHRALead(model))) {
            fieldGroupProposalFields.push(hrLeadNoteField);
        }

        if (bodComplete || (this.checkApproveRecruitmentProposalBOD() && this.checkStatusRecruitmentProposalApproveBOD(model))) {
            fieldGroupProposalFields.push(bodNoteField);
        }

        this.recruitmentProposalFieldEs.push(recruitmentProposalFields);
        this.recruitmentProposalFormEs.push(new FormGroup({}));

        let recruitmentProposalModel: any = {};
        recruitmentProposalModel.netSalary = model.netSalary;
        recruitmentProposalModel.applyPositionId = model.applyPositionId;
        recruitmentProposalModel.teamId = model.teamId;
        recruitmentProposalModel.productivity = model.productivity;
        recruitmentProposalModel.project = model.project;
        recruitmentProposalModel.hrNote = model.hrNote;
        recruitmentProposalModel.hrLeadNote = model.hrLeadNote;
        recruitmentProposalModel.bodNote = model.bodNote;
        recruitmentProposalModel.id = model.id;

        this.recruitmentProposalModelEs.push(recruitmentProposalModel);

        this.onInitCandidateApplyPosition(applyPositionField);
        this.onInitTeamAssign(teamAssignField);
    }

    addRecruitmentProposal() {
        let model: RecruitmentProposalModel = new RecruitmentProposalModel();
        this.initRecruitmentProposalField(model);
        this.proposals.push(model);
    }

    checkCanSaveInterviewSchedule(index: number): boolean {
        return !this.interviewSchedules[index].interviewResults || this.interviewSchedules[index].interviewResults.length == 0;
    }

    checkOpenAddNewProfestionalEvaluation(index: number): boolean {
        return this.interviewSchedules[index].interviewerInfo.findIndex(e =>
            e.employeeCode == this.userStorage.getUserInfo().userCode) > -1;
    }

    lastProposalApproved(): boolean {
        if (!this.proposals || this.proposals.length == 0) {
            return false;
        }
        const lastProposal = this.proposals[this.proposals.length - 1];
        return lastProposal?.status?.code == RECRUITMENT_PROPOSAL_STATUS.BOD_APPROVED;
    }

    numberOnly(event): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }

    acceptComeback() {
        this.router.navigate(['layout/recruitment/candidate']);
    }
}
