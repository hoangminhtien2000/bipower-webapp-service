import {DatePipe} from "@angular/common";
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {TranslateService} from "@ngx-translate/core";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CATALOG_ITEM} from "src/app/core/common/constant";
import {CONFIG} from "src/app/core/config/application.config";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {EmployeeService, UserModel, UserService} from "src/app/core";
import {InterviewScheduleModel} from "src/app/core/models/recruitment/interview.schedule.model";
import {CandidateAddOtherItemComponent} from "../candidate-add-other-item/candidate-add-other-item.component";
import {EmployeeModel} from "src/app/core/models/employee/employee.model";
import {RecruitmentService} from "src/app/core/services/recruitment.service";
import {take} from "rxjs/operators";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";
import * as moment from "moment";

@Component({
    selector: 'app-interview-candidate-info',
    templateUrl: './interview-candidate-schedule-info.component.html',
    styleUrls: ['./interview-candidate-schedule-info.component.scss']
})
export class InterviewCandidateScheduleInfoComponent implements OnInit {
    constructor(
        public bsModalRef: BsModalRef,
        private datePipe: DatePipe,
        private modalService: BsModalService,
        private translate: TranslateService,
        private userService: UserService,
        private employeeService: EmployeeService,
        private toastrMessage: ToastrMessageService,
        private recruitmentService: RecruitmentService,
        public catalogItemService: CatalogItemService,
    ) {
    }

    countOpenPopupOther: number = 0;
    modalRef: BsModalRef;
    userHRs: UserModel[] = [];
    employeeInterviews: EmployeeModel[] = [];

    catalogItemContact: CatalogItemModel[] = [];
    catalogItemInterviewPlace: CatalogItemModel[] = [];
    catalogItemInterviewType: CatalogItemModel[] = [];
    catalogItemStatusAfterContact: CatalogItemModel[] = [];
    catalogItemResponse: CatalogItemModel[] = [];
    catalogItemCandidateStatus: CatalogItemModel[] = [];
    dataOptionsInterviews: any[] = []

    @Output() saveInterviewScheduleSuccess = new EventEmitter<boolean>();
    interviewScheduleModel: any = {};
    interviewCandidateScheduleInfoTitle: string;

    ngOnInit() {
        if (!this.interviewScheduleModel.candidateStatus) {
            this.interviewScheduleModel.candidateStatus = null;
        }

        if (this.interviewScheduleModel?.interviewerInfo) {
            let dataOptions: any[] = [];
            for (var item of this.interviewScheduleModel?.interviewerInfo) {
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
            this.interviewScheduleModel = {
                ...this.interviewScheduleModel,
                interviewerInfo: dataOptions
            }
            this.dataOptionsInterviews = dataOptions
        }
        
        this.onInitInterviewType();
        this.onInitInterviewPlace();
        this.onInitHRJoinInterview();
        this.onInitInterviewer();
        if (this.interviewScheduleModel.contactStatus) {
            this.updateAndReloadContactStatus(this.interviewScheduleModel.contactStatus);
        }
    }

    cancelSupportHistory() {
        this.bsModalRef.hide();
    }

    saveInterviewSchedule() {
        function getTime(time, timeSet) {
            let newTime = new Date(time);
            newTime.setMinutes(0)
            newTime.setHours(new Date(timeSet).getHours())
            newTime.setMinutes(new Date(timeSet).getMinutes())
            return newTime.getTime()
        }

        if (this.interviewScheduleForm.invalid || (new Date().getTime() - getTime(this.interviewScheduleModel.interviewTime, this.interviewScheduleModel.durationInterviewTime.from)) > 0) {
            this.interviewScheduleForm.markAllAsTouched();
            return;
        }

        let model: InterviewScheduleModel = new InterviewScheduleModel();
        model.id = this.interviewScheduleModel.id;
        model.candidateId = this.interviewScheduleModel.candidateId;
        model.title = this.interviewScheduleModel.title;
        model.interviewFromTime = this.joinDateAndTime(this.interviewScheduleModel.interviewTime, this.interviewScheduleModel.durationInterviewTime.from);
        model.interviewToTime = this.joinDateAndTime(this.interviewScheduleModel.interviewTime, this.interviewScheduleModel.durationInterviewTime.to);
        model.placeId = this.interviewScheduleModel.place;
        model.interviewTypeId = this.interviewScheduleModel.interviewType;
        model.hrId = this.interviewScheduleModel.hr;
        model.interviewerIdList = this.interviewScheduleModel.interviewerInfo.map(e => e.value);
        model.interviewerInfo = this.interviewScheduleModel.interviewerInfo;
        model.interviewLink = this.interviewScheduleModel.interviewLink;
        model.description = this.interviewScheduleModel.description;

        this.recruitmentService.saveInterviewSchedule(model).pipe(
            take(1)
        ).subscribe(response => {
            if (response) {
                this.toastrMessage.showMessageSuccess(this.translate.instant('recruitment.notify.update_interview_schedule_success'),
                    this.translate.instant('shared.common-dialog.info.title'));
                this.saveInterviewScheduleSuccess.emit(true);
                this.bsModalRef.hide();
            }
        }, error => {
            if (error.error) {
                this.toastrMessage.showMessageError(error.error.errorCode,
                    error.error.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
            }
        });
    }

    titleField: FormlyFieldConfig = {
        type: 'input',
        key: 'title',
        className: 'col-12',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_title'),
            placeholder: this.translate.instant('candidate.interview.enter_title_interview'),
            autoFocus: false,
            required: true,
            maxLength: 200
        },
        defaultValue: null
    }

    interviewTimeField: FormlyFieldConfig = {
        type: 'date',
        key: 'interviewTime',
        className: 'col-4',
        defaultValue: null,
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_date'),
            placeholder: 'DD/MM/YYYY',
            nextMonth: false,
            required: true,
            minDate: moment().format('DD/MM/YYYY')
        }
    }

    durationInterviewTimeField: FormlyFieldConfig = {
        key: 'durationInterviewTime',
        type: 'hour-range',
        className: 'col-4',
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_time'),
            placeholder: 'HH:mm - HH:mm',
            required: true,
        },
        validators: {
            durationInterviewTime: {
                expression: (c) => {
                    let time = this.interviewScheduleModel.interviewTime;
                    function getTime(time, timeSet) {
                        let newTime = new Date(time);
                        newTime.setSeconds(0)
                        newTime.setHours(new Date(timeSet).getHours())
                        newTime.setMinutes(new Date(timeSet).getMinutes())
                        return newTime.getTime()
                    }
                    return (new Date().getTime() - getTime(time, c?.value?.from) < 0 &&
                        (getTime(time, c?.value?.from) -
                            getTime(time, c?.value?.to) < 0))
                },
                message: (error: any, field: FormlyFieldConfig) => {
                    function getTime(time, timeSet) {
                        let newTime = new Date(time);
                        let timeMapping = newTime;
                        timeMapping.setSeconds(0)
                        timeMapping.setHours(new Date(timeSet).getHours())
                        timeMapping.setMinutes(new Date(timeSet).getMinutes())
                        return timeMapping.getTime()
                    }
                    return (new Date().getTime() - getTime(this.interviewScheduleModel.interviewTime, field.formControl.value.from)) > 0 ?
                        moment(field.formControl.value.from).format("DD/MM/YYYY HH:mm") + " nhỏ hơn ngày giờ hiện tại" :
                        "Thời gian bắt đầu lớn hơn thời gian kết thúc"
                }
            },
        },
    }

    placeField: FormlyFieldConfig = {
        type: 'select',
        key: 'place',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_location'),
            noSelectText: this.translate.instant('candidate.interview.choose_interview_location'),
            autoFocus: false,
            required: true
        },
        hooks: {
            onInit: (field) => {
                field.formControl.valueChanges.subscribe(placeId => {
                    if (placeId == -1) {
                        this.openPopupAddOtherPlace();
                    }
                });
            }
        },
        defaultValue: null
    }

    interviewTypeField: FormlyFieldConfig = {
        type: 'select',
        key: 'interviewType',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_form'),
            noSelectText: this.translate.instant('candidate.interview.choose_interview_form'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    hrField: FormlyFieldConfig = {
        type: 'select',
        key: 'hr',
        className: 'col-4',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.HR_participated_in_interview'),
            noSelectText: this.translate.instant('candidate.interview.choose_hr_participated_in_interview'),
            autoFocus: false,
            required: true
        },
        defaultValue: null
    }

    interviewerField: FormlyFieldConfig = {
        type: 'multiselect-short',
        key: 'interviewerInfo',
        className: 'col-12',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.expert_interviewer'),
            placeholder: this.translate.instant('candidate.interview.choose_expert_interviewer'),
            autoFocus: false,
            required: true
        },

        defaultValue: this.dataOptionsInterviews
    }

    interviewLinkField: FormlyFieldConfig = {
        type: 'input',
        key: 'interviewLink',
        className: 'col-12',
        focus: false,
        templateOptions: {
            label: this.translate.instant('candidate.interview.interview_link'),
            placeholder: this.translate.instant('candidate.interview.enter_interview_link'),
            autoFocus: false,
            required: false,
            maxLength: 200
        },
        defaultValue: null
    }


    descriptionField: FormlyFieldConfig = {
        key: 'description',
        type: 'textarea',
        className: 'col-12',
        templateOptions: {
            label: this.translate.instant('candidate.interview.description_info'),
            placeholder: this.translate.instant('candidate.interview.enter_info'),
            rows: 5,
            required: false,
            maxLength: 1000
        }
    }

    interviewScheduleFields: FormlyFieldConfig[] = [
        {
            fieldGroupClassName: 'row',
            fieldGroup: [
                this.titleField,
                this.interviewTimeField,
                this.durationInterviewTimeField,
                this.placeField,
                this.interviewTypeField,
                this.hrField,
                this.interviewerField,
                this.interviewLinkField,
                this.descriptionField
            ]
        }
    ];
    interviewScheduleForm: FormGroup = new FormGroup({});

    onInitInterviewType() {
        this.catalogItemService.getItems(CATALOG_ITEM.INTERVIEW_TYPE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemInterviewType = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemInterviewType) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.interviewTypeField.templateOptions.options = dataOptions;
        });
    }

    onInitInterviewPlace() {
        this.catalogItemService.getItems(CATALOG_ITEM.INTERVIEW_PLACE).subscribe(data => {
            if (data.status.success) {
                this.catalogItemInterviewPlace = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.catalogItemInterviewPlace) {
                let optionStatus: any = {
                    value: item.item_id,
                    label: item.name
                }
                dataOptions.push(optionStatus);
            }
            this.addOptionOther(dataOptions);
            this.placeField.templateOptions.options = dataOptions;
        });
    }

    onInitHRJoinInterview() {
        this.userService.getHRList().subscribe(data => {
            if (data.status.success) {
                this.userHRs = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.userHRs) {
                let label: string = item.user_code;
                if (item.full_name && item.full_name.length > 0) {
                    label = label + ' - ' + item.full_name;
                    let optionInChargeUser: any = {
                        value: item.user_id,
                        label: label
                    }
                    dataOptions.push(optionInChargeUser);
                }
                this.hrField.templateOptions.options = dataOptions;
            }
        });
    }


    onInitInterviewer() {
        this.employeeService.searchEmployeeForSuggest('').subscribe(data => {
            if (data.success) {
                this.employeeInterviews = data.data;
            }
            let dataOptions: any[] = [];
            for (var item of this.employeeInterviews) {
                let label: string = item.fullName;
                if (item && item.companyEmail.length > 0) {
                    label = label + ' (' + item.companyEmail + ')';
                }
                let optionInChargeUser: any = {
                    value: item.id,
                    label: label
                }
                dataOptions.push(optionInChargeUser);
            }
            this.interviewerField.templateOptions.options = dataOptions;
        });

    }

    private addOptionOther(dataOptions: any[]) {
        let dataOptionStatusOther: any = {
            value: -1,
            label: this.translate.instant('candidate.add_item_other.other_option')
        };
        dataOptions.push(dataOptionStatusOther);
    }

    private openPopupAddOtherPlace() {
        this.countOpenPopupOther++;
        if (this.countOpenPopupOther == 1) {
            this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
                initialState: {
                    catalogCode: CATALOG_ITEM.INTERVIEW_PLACE,
                    otherItem: this.translate.instant('candidate.interview.interview_location'),
                    titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
                        {itemName: this.translate.instant('candidate.interview.interview_location')})
                },
                class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
                ignoreBackdropClick: true,
                keyboard: false
            });

            if (this.modalRef) {
                (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
                    if (res.item_id > 0) {
                        this.placeField.formControl.setValue(res.item_id);
                        this.placeField.formControl.markAllAsTouched();
                        this.onInitInterviewPlace();
                        this.countOpenPopupOther = 0;
                    }
                });
                (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
                    if (res) {
                        this.placeField.formControl.setValue(null);
                        this.placeField.formControl.markAllAsTouched();
                        this.countOpenPopupOther = 0;
                    }
                });
            }
        }
    }

    private joinDateAndTime(date: Date, time: Date): string {
        const dateStr = this.datePipe.transform(date, 'yyyy-MM-dd');
        const timeStr = moment(time).format('HH:mm:ss');
        return `${dateStr}T${timeStr}Z`
    }

    closeModal() {
        this.bsModalRef.hide();
    }

    checkContactStatusContacted(contactStatusId: number) {
        for (let contactStatus of this.catalogItemInterviewPlace) {
            if (contactStatus.item_id == contactStatusId
                && contactStatus.code == CONFIG.CANDIDATE.CONTACT_STATUS_CONTACTED) {
                return true;
            }
        }
        return false;
    }

    uploadAndValidateContactStatusContacted() {
        this.titleField.templateOptions.required = true;
        this.titleField.formControl?.updateValueAndValidity();

        this.interviewTimeField.templateOptions.required = true;
        this.interviewTimeField.formControl?.updateValueAndValidity();

        this.interviewTypeField.templateOptions.required = true;
        this.interviewTypeField.formControl?.updateValueAndValidity();

    }

    uploadAndValidateContactStatusNoneContacted() {
        this.titleField.templateOptions.required = true;
        this.titleField.formControl?.updateValueAndValidity();

        this.interviewTimeField.templateOptions.required = true;
        this.interviewTimeField.formControl?.updateValueAndValidity();

        this.interviewTypeField.templateOptions.required = false;
        this.interviewTypeField.formControl?.updateValueAndValidity();

    }

    updateAndReloadContactStatus(contactStatusId: number) {
        if (this.checkContactStatusContacted(contactStatusId)) {
            this.uploadAndValidateContactStatusContacted();
        } else {
            this.uploadAndValidateContactStatusNoneContacted();
        }
    }
}
