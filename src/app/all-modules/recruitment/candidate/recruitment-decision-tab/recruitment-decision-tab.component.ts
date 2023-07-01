import {DatePipe} from "@angular/common";
import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import * as moment from "moment";
import {delay, take} from 'rxjs/operators';
import {EmployeeService} from "src/app/core";
import {
    CATALOG_ITEM,
    CONTRACT_PERIOD,
    CONTRACT_TYPE,
    MIME_TYPE,
    RECRUITMENT_DECISION_STATUS,
    RECRUITMENT_PROPOSAL_STATUS
} from 'src/app/core/common/constant';
import {CONFIG} from "src/app/core/config/application.config";
import {CandidateModel} from "src/app/core/models/candidate.model";
import {CatalogItemModel} from 'src/app/core/models/catalog.item.model';
import {EmployeeModel} from "src/app/core/models/employee/employee.model";
import {OnboardStatusModel} from "src/app/core/models/recruitment/onboard.status.model";
import {RecruitmentDecisionModel} from 'src/app/core/models/recruitment/recruitment.decision.model';
import {RecruitmentProposalModel} from 'src/app/core/models/recruitment/recruitment.proposal.model';
import {
    RejectApprovalRecruitmentDecisionModel
} from "src/app/core/models/recruitment/reject.approval.recruitment.decision.model";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {RecruitmentService} from "src/app/core/services/recruitment.service";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";
import {UserStorage} from "src/app/core/storage/user.storage";
import {DateTimeUtils} from "src/libs/core/src/utils/date-time.utils";
import * as FileSaver from 'file-saver';
import {CandidateDetailComponent} from "../candidate-detail/candidate-detail.component";

@Component({
    selector: 'app-recruitment-decision-tab',
    templateUrl: './recruitment-decision-tab.component.html',
    styleUrls: ['./recruitment-decision-tab.component.scss']
})
export class RecruitmenDecisionTabComponent implements OnInit, OnChanges {

    constructor(private userStorage: UserStorage,
                private datePipe: DatePipe,
                private toastrMessage: ToastrMessageService,
                private employeeService: EmployeeService,
                public catalogItemService: CatalogItemService,
                private translate: TranslateService,
                private detailComponent: CandidateDetailComponent,
                private recruitmentService: RecruitmentService) {
    }

    @Input() candidateInfo: CandidateModel;
    candidateStatusValid: boolean = false;
    existRecruitmentDecision: boolean = false;
    canMakeRecruitmentDecision: boolean = false;
    proposals: RecruitmentProposalModel[] = [];
    proposalApprove: RecruitmentProposalModel = new RecruitmentProposalModel();

    candidateStatusOnboard: boolean = false;
    candidateNotHaveOffer: boolean = false;
    canApprovalDecision: boolean = false;

    recruitmentDecisions: RecruitmentDecisionModel[] = [];

    catalogItemApplyPosition: CatalogItemModel[] = [];
    catalogItemContactType: CatalogItemModel[] = [];
    catalogItemContractPeriod: CatalogItemModel[] = [];
    catalogItemWorkingPlace: CatalogItemModel[] = [];
    catalogItemWorkingTime: CatalogItemModel[] = [];

    contactTypeDefault: number = 0;
    contractPeriodDefault: number = 0;
    contractTypeIdLabour: number = 0;
    contractTypeIdSeasonal: number = 0;
    contractTypeIdProbationary: number = 0;
    indexRecruitmentDecisionModel: number = 0;


    recruitmentDecisionBeginModelEs: any[] = [];
    recruitmentDecisionBeginFormEs: FormGroup[] = [];
    recruitmentDecisionBeginFieldEs: FormlyFieldConfig[][] = [];

    recruitmentDecisionSalaryModelEs: any[] = [];
    recruitmentDecisionSalaryFormEs: FormGroup[] = [];
    recruitmentDecisionSalaryFieldEs: FormlyFieldConfig[][] = [];

    recruitmentDecisionEndModelEs: any[] = [];
    recruitmentDecisionEndFormEs: FormGroup[] = [];
    recruitmentDecisionEndFieldEs: FormlyFieldConfig[][] = [];

    employeeContactUsers: EmployeeModel[] = [];


    onboardStatusFieldEs: FormlyFieldConfig[][] = [];
    onboardStatusModelEs: any[] = [];
    onboardStatusFormEs: FormGroup[] = [];


    ngOnInit(): void {
        this.indexRecruitmentDecisionModel = 0;
        this.recruitmentDecisions = [];
        this.onInitContractTypeDefault();
        this.onInitContractPeriodDefault();
        this.onInitContactUserDefault();
        this.initByDetailInterviewScheduleTab();
        this.canApprovalDecision = this.userStorage.existPermission('approval_recruitment_decision');
        this.canMakeRecruitmentDecision = this.userStorage.existPermission('create_recruitment_decision') ||
            this.userStorage.getUserInfo().userId == this.candidateInfo?.in_charge_user_id;
        this.candidateStatusOnboard = this.checkStatusOnboard();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['candidateInfo'] && this.candidateInfo) {
            this.candidateNotHaveOffer = this.candidateInfo.status.code == CONFIG.CANDIDATE.CANDIDATE_NOT_HAVE_OFFER
        }
    }

    public checkStatusRecruitmentProposalApproveBOD(model: RecruitmentProposalModel): boolean {
        if (model.status && (model.status.code == RECRUITMENT_PROPOSAL_STATUS.BOD_APPROVED)) {
            return true;
        }
        return false;
    }

    initByDetailInterviewScheduleTab(): void {
        this.recruitmentService.getInterviewInfo(this.candidateInfo.candidate_id).pipe(
            take(1)
        ).subscribe(data => {
            if (data.status && data.status.success) {
                if (data.data.proposals) {
                    this.proposals = data.data.proposals;
                    for (let proposal of this.proposals) {
                        if (this.checkStatusRecruitmentProposalApproveBOD(proposal)) {
                            this.candidateStatusValid = true;
                            this.proposalApprove = proposal;
                        }
                    }
                }

                if (data.data.recruitmentDecisions && data.data.recruitmentDecisions.length > 0) {
                    this.recruitmentDecisions = data.data.recruitmentDecisions;
                    this.existRecruitmentDecision = true;
                    this.recruitmentDecisions = data.data.recruitmentDecisions;
                    for (let model of data.data.recruitmentDecisions) {
                        this.makeRecruitmentDecisionScreen(model);
                    }
                }
            }
        })
    }

    makeRecruitmentDecisionScreen(model: RecruitmentDecisionModel): void {
        this.initRecruitmentDecisionBeginField(this.indexRecruitmentDecisionModel, model);
        this.initRecruitmentDecisionEndField(model);
        this.initOnboardStatusField(this.indexRecruitmentDecisionModel, model);
    }

    makeRecruitmentDecision() {
        let model: RecruitmentDecisionModel = new RecruitmentDecisionModel();
        this.makeRecruitmentDecisionScreen(model);
        this.recruitmentDecisions.push(model);
        this.indexRecruitmentDecisionModel++;
    }

    saveRecruitmentDecision(index: number) {
        let recruitmentDecisionModel: RecruitmentDecisionModel = new RecruitmentDecisionModel();
        recruitmentDecisionModel.id = this.recruitmentDecisionBeginModelEs[index].id;
        recruitmentDecisionModel.candidateId = this.candidateInfo.candidate_id;
        recruitmentDecisionModel.contractTypeId = this.recruitmentDecisionBeginModelEs[index].contractTypeId;
        recruitmentDecisionModel.contractPeriodId = this.recruitmentDecisionBeginModelEs[index].contractPeriodId;
        if (this.recruitmentDecisionBeginModelEs[index].startWorkDate) {
            recruitmentDecisionModel.startWorkDate = this.datePipe.transform(this.recruitmentDecisionBeginModelEs[index].startWorkDate, 'yyyy-MM-dd') + 'T00:00:00Z';
        }

        recruitmentDecisionModel.probationarySalary = this.recruitmentDecisionSalaryModelEs[index].probationarySalary;
        recruitmentDecisionModel.basicSalary = this.recruitmentDecisionSalaryModelEs[index].basicSalary;

        if (recruitmentDecisionModel.contractTypeId == this.contractTypeIdProbationary) {
            recruitmentDecisionModel.officialSalary = this.proposalApprove.netSalary;
            recruitmentDecisionModel.probationarySalary = this.recruitmentDecisionSalaryModelEs[index].probationarySalary;
            recruitmentDecisionModel.basicSalary = this.recruitmentDecisionSalaryModelEs[index].basicSalary;
        }

        if (recruitmentDecisionModel.contractTypeId == this.contractTypeIdLabour) {
            recruitmentDecisionModel.officialSalary = this.proposalApprove.netSalary;
            recruitmentDecisionModel.basicSalary = this.recruitmentDecisionSalaryModelEs[index].basicSalary;
        }

        if (recruitmentDecisionModel.contractTypeId == this.contractTypeIdSeasonal) {
            recruitmentDecisionModel.negotiableSalary = this.recruitmentDecisionSalaryModelEs[index].negotiableSalary;
            recruitmentDecisionModel.proposedSalary = this.recruitmentDecisionSalaryModelEs[index].proposedSalary;
        }

        recruitmentDecisionModel.workingPlaceId = this.recruitmentDecisionEndModelEs[index].workingPlaceId;
        recruitmentDecisionModel.workingTimeId = this.recruitmentDecisionEndModelEs[index].workingTimeId;

        recruitmentDecisionModel.compensationBenefit = this.recruitmentDecisionEndModelEs[index].compensationBenefit;
        recruitmentDecisionModel.effortReview = this.recruitmentDecisionEndModelEs[index].effortReview;
        recruitmentDecisionModel.otherIncome = this.recruitmentDecisionEndModelEs[index].otherIncome;
        recruitmentDecisionModel.training = this.recruitmentDecisionEndModelEs[index].training;
        recruitmentDecisionModel.otherBenefit = this.recruitmentDecisionEndModelEs[index].otherBenefit;
        recruitmentDecisionModel.jobDescription = this.recruitmentDecisionEndModelEs[index].otherBenefit;
        recruitmentDecisionModel.contactUserId = this.recruitmentDecisionEndModelEs[index].contactUserId;
        recruitmentDecisionModel.contactUserPhone = this.recruitmentDecisionEndModelEs[index].contactUserPhone;
        recruitmentDecisionModel.contactUserEmail = this.recruitmentDecisionEndModelEs[index].contactUserEmail;
        recruitmentDecisionModel.inchargeHrNote = this.recruitmentDecisionEndModelEs[index].inchargeHrNote;
        recruitmentDecisionModel.effort = this.recruitmentDecisionEndModelEs[index].effort;

        this.recruitmentService.createRecruitmentDecision(recruitmentDecisionModel).subscribe(response => {
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_hr_evaluation_success'),
                this.translate.instant('shared.common-dialog.info.title'));
            // this.detailComponent.getCandidateDetail();
            // this.initByDetailInterviewScheduleTab();
            this.detailComponent.resetTab();
        }, error => {
            this.toastrMessage.showMessageErrorHttp(error, this.translate.instant('shared.common-dialog.warning.title'));
        });
    }

    rejectRecruitmentDecision(index: number): void {
        let rejectApprovalRecruitmentDecisionModel: RejectApprovalRecruitmentDecisionModel = new RejectApprovalRecruitmentDecisionModel();
        rejectApprovalRecruitmentDecisionModel.id = this.recruitmentDecisionBeginModelEs[index].id;
        rejectApprovalRecruitmentDecisionModel.note = this.recruitmentDecisionEndModelEs[index].hrLeadNote;
        rejectApprovalRecruitmentDecisionModel.approval = false;

        this.recruitmentService.rejectApprovalRecruitmentDecision(rejectApprovalRecruitmentDecisionModel).subscribe(response => {
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_hr_evaluation_success'),
                this.translate.instant('shared.common-dialog.info.title'));
            // this.detailComponent.getCandidateDetail();
            // this.initByDetailInterviewScheduleTab();
            this.detailComponent.resetTab();
        }, error => {
            this.toastrMessage.showMessageErrorHttp(error, this.translate.instant('shared.common-dialog.warning.title'));
        });

    }

    approveRecruitmentDecision(index: number): void {
        let rejectApprovalRecruitmentDecisionModel: RejectApprovalRecruitmentDecisionModel = new RejectApprovalRecruitmentDecisionModel();
        rejectApprovalRecruitmentDecisionModel.id = this.recruitmentDecisionBeginModelEs[index].id;
        rejectApprovalRecruitmentDecisionModel.note = this.recruitmentDecisionEndModelEs[index].hrLeadNote;
        rejectApprovalRecruitmentDecisionModel.approval = true;

        this.recruitmentService.rejectApprovalRecruitmentDecision(rejectApprovalRecruitmentDecisionModel).subscribe(
            response => {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_hr_evaluation_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                // this.detailComponent.getCandidateDetail();
                // this.initByDetailInterviewScheduleTab();
                this.detailComponent.resetTab();
            }, error => {
                this.toastrMessage.showMessageErrorHttp(error, this.translate.instant('shared.common-dialog.warning.title'));
            });

    }

    exportRecruitmentDecision(index: number) {
        this.recruitmentService.exportOffer(this.recruitmentDecisionBeginModelEs[index].id).subscribe(res => {
            const fileName = res.headers.get('FILE_NAME');
            const data = new Blob([res.body], {type: MIME_TYPE.PDF});
            FileSaver.saveAs(data, fileName);
        }, error => {
            this.toastrMessage.showMessageErrorHttp(error, this.translate.instant('shared.common-dialog.warning.title'));
        });
    }

    onInitCandidateApplyPosition(applyPositionField: FormlyFieldConfig) {
        this.catalogItemService.getItems(CATALOG_ITEM.APPLY_POSITION).subscribe(data => {
            if (data.status.success) {
                this.catalogItemApplyPosition = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemApplyPosition) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            applyPositionField.templateOptions.options = dataOptions;
        });
    }


    onInitContractType(contactTypeField: FormlyFieldConfig) {
        let dataOptions: any[] = [];
        for (var item of this.catalogItemContactType) {
            let optionStatus: any = {
                value: item.item_id,
                label: item.name
            }
            dataOptions.push(optionStatus);
        }
        contactTypeField.templateOptions.options = dataOptions;
    }


    onInitContractTypeDefault() {
        this.catalogItemService.getItems(CATALOG_ITEM.CONTRACT_TYPE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemContactType = data.data;
                for (var item of this.catalogItemContactType) {
                    if (item.code == CONTRACT_TYPE.PROBATIONARY_CONTRACT) {
                        this.contactTypeDefault = item.item_id;
                        this.contractTypeIdProbationary = item.item_id;
                    }
                    if (item.code == CONTRACT_TYPE.LABOUR_CONTRACT) {
                        this.contractTypeIdLabour = item.item_id;
                    }

                    if (item.code == CONTRACT_TYPE.SEASONAL_CONTRACT) {
                        this.contractTypeIdSeasonal = item.item_id;
                    }
                }
            }
        });
    }

    onInitContractPeriod(contractPeriodField: FormlyFieldConfig) {
        let dataOptions: any[] = [];
        for (var item of this.catalogItemContractPeriod) {
            let optionStatus: any = {
                value: item.item_id,
                label: item.name
            }
            dataOptions.push(optionStatus);
        }
        contractPeriodField.templateOptions.options = dataOptions;
    }


    onInitContractPeriodDefault() {
        this.catalogItemService.getItems(CATALOG_ITEM.CONTRACT_PERIOD).subscribe(data => {
            if (data.status.success) {
                this.catalogItemContractPeriod = data.data;
                for (var item of this.catalogItemContractPeriod) {
                    if (item.code == CONTRACT_PERIOD.TWO_MONTHS) {
                        this.contractPeriodDefault = item.item_id;
                    }
                }
            }
        });
    }

    initRecruitmentDecisionBeginField(index: number, model: RecruitmentDecisionModel): void {
        const decisionCompleted = model.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_REJECT ||
            model.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_APPROVED;
        let applyPositionField: FormlyFieldConfig = {
            type: 'select',
            key: 'applyPositionId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: this.translate.instant('candidate.interview.job_position'),
                noSelectText: this.translate.instant('candidate.interview.enter_job_position'),
                autoFocus: false,
                required: true,
                disabled: true
            },
            defaultValue: null,
        }

        let contractTypeField: FormlyFieldConfig = {
            type: 'select',
            key: 'contractTypeId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: this.translate.instant('candidate.interview.type_contract'),
                noSelectText: this.translate.instant('candidate.interview.enter_type_contract'),
                autoFocus: false,
                required: true,
                disabled: decisionCompleted
            },
            defaultValue: null,
            hooks: {
                onInit: (field) => {
                    field.formControl.valueChanges.subscribe(contractTypeId => {
                        this.recruitmentDecisionSalaryFieldEs.splice(index, 1);
                        this.recruitmentDecisionSalaryFormEs.splice(index, 1);
                        this.recruitmentDecisionSalaryModelEs.splice(index, 1);
                        this.initRecruitmentDecisionSalaryField(contractTypeId, model);
                    });
                }
            }
        }

        let contractPeriodField: FormlyFieldConfig = {
            type: 'select',
            key: 'contractPeriodId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: this.translate.instant('candidate.interview.contract_term'),
                noSelectText: this.translate.instant('candidate.interview.enter_contract_term'),
                autoFocus: false,
                required: true,
                disabled: decisionCompleted
            },
            defaultValue: null,
            hooks: {}
        }

        let startWorkDateField: FormlyFieldConfig = {
            type: 'date',
            key: 'startWorkDate',
            className: 'col-3',
            defaultValue: null,
            templateOptions: {
                label: this.translate.instant('candidate.interview.date_of_receiving_job'),
                placeholder: 'DD/MM/YYYY',
                nextMonth: false,
                required: true,
                minDate: moment().format('DD/MM/YYYY'),
                disabled: decisionCompleted
            }
        }

        let recruitmentDecisionBeginFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: [
                    applyPositionField,
                    contractTypeField,
                    contractPeriodField,
                    startWorkDateField
                ]
            }
        ];

        this.recruitmentDecisionBeginFormEs.push(new FormGroup({}));
        this.recruitmentDecisionBeginFieldEs.push(recruitmentDecisionBeginFields);

        let recruitmentDecisionBeginModel: any = {};
        recruitmentDecisionBeginModel.id = model.id;
        recruitmentDecisionBeginModel.applyPositionId = this.proposalApprove.applyPositionId;
        if (!model.contractTypeId) {
            recruitmentDecisionBeginModel.contractTypeId = this.contactTypeDefault;
        } else {
            recruitmentDecisionBeginModel.contractTypeId = model.contractTypeId;
        }
        this.initRecruitmentDecisionSalaryField(recruitmentDecisionBeginModel.contractTypeId, model);
        if (!model.contractPeriodId) {
            recruitmentDecisionBeginModel.contractPeriodId = this.contractPeriodDefault;
        } else {
            recruitmentDecisionBeginModel.contractPeriodId = model.contractPeriodId;
        }
        recruitmentDecisionBeginModel.startWorkDate = DateTimeUtils.parser(model.startWorkDate, 'YYYY-MM-DD');
        this.recruitmentDecisionBeginModelEs.push(recruitmentDecisionBeginModel);

        this.onInitCandidateApplyPosition(applyPositionField);
        this.onInitContractType(contractTypeField);
        this.onInitContractPeriod(contractPeriodField);
    }

    initRecruitmentDecisionSalaryField(contractTypeId: number, model: RecruitmentDecisionModel): void {
        const decisionComplete = model?.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_REJECT ||
            model?.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_APPROVED;
        let netSalaryField: FormlyFieldConfig = {
            key: 'netSalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.official_salary'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: true,
                attributes: {
                    'appCurencyFormat': 'true'
                }
            }
        }

        let probationarySalaryField: FormlyFieldConfig = {
            key: 'probationarySalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.probational_salary'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: decisionComplete
            }
        }

        let basicSalaryField: FormlyFieldConfig = {
            key: 'basicSalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.salary_for_social_insurance'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: decisionComplete
            }
        }

        let negotiableSalaryField: FormlyFieldConfig = {
            key: 'negotiableSalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.salary_negotiation'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: true
            }
        }

        let proposedSalaryField: FormlyFieldConfig = {
            key: 'proposedSalary',
            type: 'currency',
            className: 'col-3',
            templateOptions: {
                suffixText: 'VND',
                label: this.translate.instant('candidate.interview.suggested_salary'),
                placeholder: this.translate.instant('candidate.interview.enter_salary'),
                required: true,
                disabled: decisionComplete
            }
        }

        let effortField: FormlyFieldConfig = {
            key: 'effort',
            type: 'input',
            className: 'col-3',
            templateOptions: {
                label: this.translate.instant('EmployeeProfile.performanceInfoModal.effort'),
                placeholder: this.translate.instant('EmployeeProfile.performanceInfoModal.pHeffort'),
                required: false,
                disabled: decisionComplete
            }
        }

        let fieldConfigProbationarys: FormlyFieldConfig[] = [
            netSalaryField,
            probationarySalaryField,
            basicSalaryField,
            effortField
        ];

        let fieldConfigLabours: FormlyFieldConfig[] = [
            netSalaryField,
            basicSalaryField
        ];

        let fieldConfigSeasonals: FormlyFieldConfig[] = [
            negotiableSalaryField,
            proposedSalaryField
        ];
        let recruitmentDecisionSalaryFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row'
            }
        ];

        if (contractTypeId == this.contractTypeIdProbationary) {
            recruitmentDecisionSalaryFields[0].fieldGroup = fieldConfigProbationarys;
        }

        if (contractTypeId == this.contractTypeIdLabour) {
            recruitmentDecisionSalaryFields[0].fieldGroup = fieldConfigLabours;
        }

        if (contractTypeId == this.contractTypeIdSeasonal) {
            recruitmentDecisionSalaryFields[0].fieldGroup = fieldConfigSeasonals;
        }

        this.recruitmentDecisionSalaryFormEs.push(new FormGroup({}));
        this.recruitmentDecisionSalaryFieldEs.push(recruitmentDecisionSalaryFields);

        let recruitmentDecisionSalaryModel: any = {};
        recruitmentDecisionSalaryModel.netSalary = this.proposalApprove.netSalary;
        recruitmentDecisionSalaryModel.probationarySalary = model.probationarySalary;
        recruitmentDecisionSalaryModel.basicSalary = model.basicSalary;
        recruitmentDecisionSalaryModel.effort = model.effort;
        if (!model.negotiableSalary) {
            recruitmentDecisionSalaryModel.negotiableSalary = this.proposalApprove.netSalary;
        } else {
            recruitmentDecisionSalaryModel.negotiableSalary = model.negotiableSalary;
        }
        recruitmentDecisionSalaryModel.proposedSalary = model.proposedSalary;

        this.recruitmentDecisionSalaryModelEs.push(recruitmentDecisionSalaryModel);
    }

    onInitContactUserDefault() {
        this.employeeService.searchEmployeeForSuggest('').subscribe(data => {
            if (data.success) {
                this.employeeContactUsers = data.data;
            }
        });
    }


    onInitContactUser(contactUserField: FormlyFieldConfig) {
        let dataOptions: any[] = [];
        for (var item of this.employeeContactUsers) {
            let label: string = item.fullName;
            if (item.companyEmail && item.companyEmail.length > 0) {
                label = label + ' (' + item.companyEmail + ')';
            }
            let optionInChargeUser: any = {
                value: item.id,
                label: label
            }
            dataOptions.push(optionInChargeUser);
        }
        contactUserField.templateOptions.options = dataOptions;
    }


    initRecruitmentDecisionEndField(model: RecruitmentDecisionModel): void {
        const decisionComplete = model?.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_REJECT ||
            model?.statusItem?.code == RECRUITMENT_DECISION_STATUS.HR_LEAD_APPROVED;
        let workingPlaceField: FormlyFieldConfig = {
            key: 'workingPlaceId',
            type: 'select',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.work_location'),
                noSelectText: this.translate.instant('candidate.interview.choose_work_location'),
                required: true,
                disabled: decisionComplete
            },
            defaultValue: null
        }

        let workingTimeField: FormlyFieldConfig = {
            key: 'workingTimeId',
            type: 'select',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.working_time'),
                noSelectText: this.translate.instant('candidate.interview.enter_working_time'),
                required: true,
                disabled: decisionComplete
            },
            defaultValue: null
        };

        let compensationBenefitField: FormlyFieldConfig = {
            key: 'compensationBenefit',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.allowances'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            },
            defaultValue: this.translate.instant('candidate.interview.allowances_default')
        }

        let effortReviewField: FormlyFieldConfig = {
            key: 'effortReview',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.effectiveness_of_work'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            },
            defaultValue: this.translate.instant('candidate.interview.times_year')
        }

        let otherIncomeField: FormlyFieldConfig = {
            key: 'otherIncome',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.other_income'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            },
            defaultValue: this.translate.instant('candidate.interview.quarterly_bonus')
        }

        let trainingField: FormlyFieldConfig = {
            key: 'training',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.train'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            },
            defaultValue: this.translate.instant('candidate.interview.join_training_courses')
        }

        let otherBenefitField: FormlyFieldConfig = {
            key: 'otherBenefit',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label:  this.translate.instant('candidate.interview.other_perks'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            },
            defaultValue: this.translate.instant('candidate.interview.company_remuneration_policy')
        }

        let jobDescriptionField: FormlyFieldConfig = {
            key: 'jobDescription',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.job_description'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true,
                disabled: decisionComplete
            }
        }

        let contactUserField: FormlyFieldConfig = {
            type: 'autocomplete',
            key: 'contactUserId',
            className: 'col-3',
            focus: false,
            templateOptions: {
                label: this.translate.instant('candidate.contact_history.contact_user'),
                placeholder: this.translate.instant('candidate.interview.search_contact'),
                autoFocus: false,
                required: true,
                valueKey: 'id',
                labelKey: ['employeeCode', 'fullName'],
                api: {
                    url: CONFIG.API.EMPLOYEE.SUGGEST_SEARCH,
                    lazySearch: 'input',
                    responsePath: 'data',
                    params: {
                        page: 0,
                        page_size: 10
                    }
                },
                disabled: decisionComplete
            },
            hooks: {
                onInit: (field) => {
                    field.formControl.valueChanges.subscribe(contactUserId => {
                        for (let userModel of this.employeeContactUsers) {
                            if (userModel.id == contactUserId) {
                                contactUserPhoneField.formControl.setValue(userModel.phone);
                                contactUserEmailField.formControl.setValue(userModel.companyEmail);
                            }
                        }
                    });
                }
            },
            defaultValue: null
        }

        let contactUserPhoneField: FormlyFieldConfig = {
            key: 'contactUserPhone',
            type: 'input',
            className: 'col-3',
            templateOptions: {
                label: this.translate.instant('candidate.model.phone'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                required: true,
                disabled: true
            }
        }

        let contactUserEmailField: FormlyFieldConfig = {
            key: 'contactUserEmail',
            type: 'input',
            className: 'col-3',
            templateOptions: {
                label: 'Email',
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                required: true,
                disabled: true
            }
        }

        let inchargeHrNoteField: FormlyFieldConfig = {
            key: 'inchargeHrNote',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.note_from_hr'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: false,
                disabled: decisionComplete
            }
        }

        let hrLeadNoteField: FormlyFieldConfig = {
            key: 'hrLeadNote',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: 'Ghi chú của HR lead',
                placeholder: 'Nhập kết luận',
                rows: 3,
                required: false,
                disabled: decisionComplete
            }
        }
        
        let recruitmentDecisionEndFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: [
                    workingPlaceField,
                    workingTimeField,
                    compensationBenefitField,
                    effortReviewField,
                    otherIncomeField,
                    trainingField,
                    otherBenefitField,
                    jobDescriptionField,
                    contactUserField,
                    contactUserPhoneField,
                    contactUserEmailField,
                    inchargeHrNoteField
                ]
            }
        ];

        if (this.checkStatusRecruitmentDecisionEdit(model) || decisionComplete) {
            recruitmentDecisionEndFields[0].fieldGroup.push(hrLeadNoteField);
        }


        this.recruitmentDecisionEndFormEs.push(new FormGroup({}));
        this.recruitmentDecisionEndFieldEs.push(recruitmentDecisionEndFields);

        let recruitmentDecisionEndModel: any = {};
        recruitmentDecisionEndModel.jobDescription = model.jobDescription;
        recruitmentDecisionEndModel.contactUserId = model.contactUserId;
        recruitmentDecisionEndModel.inchargeHrNote = model.inchargeHrNote;
        recruitmentDecisionEndModel.workingPlaceId = model.workingPlaceId;
        recruitmentDecisionEndModel.workingTimeId = model.workingTimeId;
        recruitmentDecisionEndModel.hrLeadNote = model.hrLeadNote;
        this.recruitmentDecisionEndModelEs.push(recruitmentDecisionEndModel);
        this.onInitContactUser(contactUserField);
        if (model.contactUserId) {
            this.updateOnboardStatusField(model.contactUserId, recruitmentDecisionEndModel);
        }
        this.onInitWorkingPlace(workingPlaceField);
        this.onInitWorkingTime(workingTimeField);
    }

    private updateOnboardStatusField(contactUserId, recruitmentDecisionEndModel: any): void {
        for (let userModel of this.employeeContactUsers) {
            if (userModel.id == contactUserId) {
                recruitmentDecisionEndModel.contactUserPhone = userModel.phone;
                recruitmentDecisionEndModel.contactUserEmail = userModel.companyEmail;
            }
        }
    }

    initOnboardStatusField(index: number, model: RecruitmentDecisionModel): void {
        let candidateResponseField: FormlyFieldConfig = {
            key: 'candidateResponse',
            type: 'radio',
            className: 'col-5',
            templateOptions: {
                label:  this.translate.instant('candidate.interview.response_to_job_offer'),
                required: true,
                display: 'horizontal-inline',
                options: [
                    {value: true, label: this.translate.instant('candidate.btn.yes')},
                    {value: false, label: this.translate.instant('candidate.interview.refuse')}
                ],
            },
            hooks: {
                onInit: (field) => {
                    field.formControl.valueChanges.pipe(delay(0)).subscribe(candidateResponse => {
                        model.candidateResponse = candidateResponse;
                        let fieldGroupOnboardConfigs: FormlyFieldConfig[] = [];
                        if (candidateResponse != null && !model.candidateResponse) {
                            fieldGroupOnboardConfigs.push(candidateResponseField);
                            fieldGroupOnboardConfigs.push(rejectReasonField);
                        } else {
                            fieldGroupOnboardConfigs.push(candidateResponseField);
                            fieldGroupOnboardConfigs.push(estimatedOnboardDateField);
                            fieldGroupOnboardConfigs.push(onboardStatusField);
                            if (model.onboardStatus != null && !model.onboardStatus) {
                                fieldGroupOnboardConfigs.push(rejectOnboardReasonField);
                            } else {
                                fieldGroupOnboardConfigs.push(onboardDateDateField);
                            }
                        }
                        fieldGroupOnboardConfigs.push(noteField);
                        this.onboardStatusFieldEs[index][0].fieldGroup = fieldGroupOnboardConfigs;
                    });
                }
            },
            defaultValue: null
        };

        let estimatedOnboardDateField: FormlyFieldConfig = {
            type: 'date',
            key: 'estimatedOnboardDate',
            className: 'col-4',
            defaultValue: null,
            templateOptions: {
                label: this.translate.instant('candidate.model.onboard_date'),
                placeholder: 'DD/MM/YYYY',
                nextMonth: false,
                required: false,
                minDate: moment().format('DD/MM/YYYY')
            }
        }


        let rejectReasonField: FormlyFieldConfig = {
            key: 'rejectReason',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.reason_for_refusal'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true
            }
        }


        let onboardStatusField: FormlyFieldConfig = {
            key: 'onboardStatus',
            type: 'radio',
            className: 'col-5',
            templateOptions: {
                label: this.translate.instant('candidate.interview.reality_on_board'),
                required: true,
                display: 'horizontal-inline',
                options: [
                    {value: true, label: this.translate.instant('candidate.interview.already_on_board')},
                    {value: false, label: this.translate.instant('candidate.interview.do_not_come_on_board')}
                ],
            },
            defaultValue: null,
            hooks: {
                onInit: (field) => {
                    field.formControl.valueChanges.pipe(delay(0)).subscribe(onboardStatus => {
                        model.onboardStatus = onboardStatus;
                        let fieldGroupOnboardConfigs: FormlyFieldConfig[] = [];
                        if (!model.candidateResponse) {
                            fieldGroupOnboardConfigs.push(candidateResponseField);
                            fieldGroupOnboardConfigs.push(rejectReasonField);
                        } else {
                            fieldGroupOnboardConfigs.push(candidateResponseField);
                            fieldGroupOnboardConfigs.push(estimatedOnboardDateField);
                            fieldGroupOnboardConfigs.push(onboardStatusField);

                            if (onboardStatus != null && !model.onboardStatus) {
                                fieldGroupOnboardConfigs.push(rejectOnboardReasonField);
                            } else {
                                fieldGroupOnboardConfigs.push(onboardDateDateField);
                            }
                        }

                        fieldGroupOnboardConfigs.push(noteField);
                        this.onboardStatusFieldEs[index][0].fieldGroup = fieldGroupOnboardConfigs;
                    });
                }
            }
        };

        let onboardDateDateField: FormlyFieldConfig = {
            type: 'date',
            key: 'onboardDate',
            className: 'col-4',
            defaultValue: null,
            templateOptions: {
                label: this.translate.instant('candidate.interview.actual_date_onboard'),
                placeholder: 'DD/MM/YYYY',
                nextMonth: false,
                required: false
            }
        }

        let rejectOnboardReasonField: FormlyFieldConfig = {
            key: 'rejectOnboardReason',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.interview.reason_not_come_onboard'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: true
            }
        }

        let noteField: FormlyFieldConfig = {
            key: 'note',
            type: 'textarea',
            className: 'col-12',
            templateOptions: {
                label: this.translate.instant('candidate.assign.note'),
                placeholder: this.translate.instant('candidate.interview.enter_conclusion'),
                rows: 3,
                required: false
            }
        }

        let onboardStatusFields: FormlyFieldConfig[] = [
            {
                fieldGroupClassName: 'row',
                fieldGroup: [
                    candidateResponseField,
                    rejectReasonField,
                    estimatedOnboardDateField,
                    onboardStatusField,
                    rejectOnboardReasonField,
                    onboardDateDateField,
                    noteField
                ]
            }
        ];

        this.onboardStatusFormEs.push(new FormGroup({}));
        this.onboardStatusFieldEs.push(onboardStatusFields);

        let onboardStatusModel: any = {};
        onboardStatusModel.candidateResponse = model.candidateResponse;
        onboardStatusModel.estimatedOnboardDate = DateTimeUtils.parser(model.estimatedOnboardDate, 'YYYY-MM-DD');
        onboardStatusModel.onboardStatus = model.onboardStatus;
        onboardStatusModel.rejectReason = model.rejectReason;
        onboardStatusModel.rejectOnboardReason = model.rejectOnboardReason;
        onboardStatusModel.onboardDate = DateTimeUtils.parser(model.onboardDate, 'YYYY-MM-DD');
        this.onboardStatusModelEs.push(onboardStatusModel);
    }

    saveOnboardStatus(index: number): void {
        let onboardStatusModel: OnboardStatusModel = new OnboardStatusModel();
        onboardStatusModel.id = this.recruitmentDecisionBeginModelEs[index].id;
        onboardStatusModel.candidateResponse = this.onboardStatusModelEs[index].candidateResponse;
        if (this.onboardStatusModelEs[index].estimatedOnboardDate) {
            onboardStatusModel.estimatedOnboardDate = this.datePipe.transform(this.onboardStatusModelEs[index].estimatedOnboardDate, 'yyyy-MM-dd') + 'T00:00:00Z';
        }

        if (this.onboardStatusModelEs[index].onboardDate) {
            onboardStatusModel.onboardDate = this.datePipe.transform(this.onboardStatusModelEs[index].onboardDate, 'yyyy-MM-dd') + 'T00:00:00Z';
        }
        onboardStatusModel.onboardStatus = this.onboardStatusModelEs[index].onboardStatus;
        onboardStatusModel.note = this.onboardStatusModelEs[index].note;
        onboardStatusModel.rejectReason = this.onboardStatusModelEs[index].rejectReason;
        onboardStatusModel.rejectOnboardReason = this.onboardStatusModelEs[index].rejectOnboardReason;

        this.recruitmentService.saveOnboardStatus(onboardStatusModel).subscribe(response => {
            this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_hr_evaluation_success'),
                this.translate.instant('shared.common-dialog.info.title'));
            // this.initByDetailInterviewScheduleTab();
            // this.detailComponent.getCandidateDetail();
            this.detailComponent.resetTab();
        }, error => {
            this.toastrMessage.showMessageErrorHttp(error, this.translate.instant('shared.common-dialog.warning.title'));
        });
    }

    public checkStatusRecruitmentDecisionEdit(model: RecruitmentDecisionModel): boolean {
        if (!model.status || (model.statusItem.code == RECRUITMENT_DECISION_STATUS.WAITING_HR_LEADER)) {
            return true;
        }
        return false;
    }

    public checkStatusRecruitmentDecisionApprove(model: RecruitmentDecisionModel): boolean {
        if (model.status && (model.statusItem.code == RECRUITMENT_DECISION_STATUS.WAITING_HR_LEADER)) {
            return true;
        }
        return false;
    }

    private checkStatusOnboard(): boolean {
        return CONFIG.CANDIDATE.STATUS_CODE_ADD_NEW_ONBOARD.includes(this.candidateInfo.status.code);
    }

    onInitWorkingPlace(workingPlaceField: FormlyFieldConfig) {
        this.catalogItemService.getItems(CATALOG_ITEM.WORKING_PLACE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemWorkingPlace = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemWorkingPlace) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            workingPlaceField.templateOptions.options = dataOptions;
        });
    }

    onInitWorkingTime(workingTimeField: FormlyFieldConfig) {
        this.catalogItemService.getItems(CATALOG_ITEM.WORKING_TIME).subscribe(data => {
            if (data.status.success) {
                this.catalogItemWorkingTime = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemWorkingTime) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            workingTimeField.templateOptions.options = dataOptions;
        });
    }
}
