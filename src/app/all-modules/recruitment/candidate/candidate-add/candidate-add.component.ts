import {DatePipe} from "@angular/common";
import {Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Router} from '@angular/router';
import {FormlyFieldConfig} from "@ngx-formly/core";
import * as moment from "moment";
import {BehaviorSubject} from "rxjs";
import {DateTimeUtils} from "src/libs/core/src/utils/date-time.utils";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {TranslateService} from "@ngx-translate/core";
import {FileService} from "src/app/core/services/file.service";
import {CandidateService} from "src/app/core/services/candidate.service";
import {CANDIDATE, CATALOG_ITEM} from "src/app/core/common/constant";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {CandidateFileModel} from "src/app/core/models/candidate.file.model";
import {CandidateAddModel} from "src/app/core/models/candidate.add.model";
import {CandidateContactModel} from "src/app/core/models/candidate.contact.model";
import {CandidateSchoolModel} from "src/app/core/models/candidate.school.model";
import {CandidateDomainModel} from "src/app/core/models/candidate.domain.model";
import {CandidateCertificateModel} from "src/app/core/models/candidate.certificate.model";
import {CandidateUploadCvModel} from "src/app/core/models/candidate.upload.cv.model";
import {CommonDialogComponent} from "src/app/sharing/common-dialog/common-dialog.component";
import {NotifyType} from "src/app/core/common/notify-type";
import {CONFIG} from "src/app/core/config/application.config";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CandidateAddOtherItemComponent} from "../candidate-add-other-item/candidate-add-other-item.component";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";
import {CountryService} from '../../../../core/services/country.service';

@Component({
  selector: 'app-candidate-add',
  templateUrl: './candidate-add.component.html',
  styleUrls: ['./candidate-add.component.scss']
})
export class CandidateAddComponent implements OnInit, OnDestroy {

  constructor(
      private candidateService: CandidateService,
      private datePipe: DatePipe,
      private modalService: BsModalService,
      public fileService: FileService,
      public catalogItemService: CatalogItemService,
      private translate: TranslateService,
      public toastrMessage: ToastrMessageService,
      private router: Router,
      private countryService: CountryService
  ) {
    this.nationalField.templateOptions.options = this.countryService.getAllMapValueLabel();
  }


  statusModel: any = {
    status: null
  };
  constantCandidate = CANDIDATE;
  now = moment();
  lastMonth = moment().subtract(30, 'day');
  candidateContactKeys: number[] = [];
  candidateContactItem: number = 0;

  statusField: FormlyFieldConfig = {
    type: 'select',
    key: 'status',
    className: 'col-6',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.status'),
      noSelectText: this.translate.instant('candidate.model.status_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null,
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(statusId => {
          this.uploadAndReloadStatus(statusId);
        });
      }
    }
  }

  canidateStatusFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        this.statusField
      ]
    }
  ];

  candidateStatusForm: FormGroup = new FormGroup({});

  candidateInfoModel: any = {
    phone: null
  };

  fullNameField: FormlyFieldConfig = {
    type: 'input',
    key: 'fullName',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.full_name'),
      placeholder: this.translate.instant('candidate.model.full_name_placeholder'),
      autoFocus: false,
      required: true,
      maxLength: 100
    },
    defaultValue: null
  }

  phoneField: FormlyFieldConfig = {
    type: 'input',
    key: 'phone',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.phone'),
      placeholder: this.translate.instant('candidate.model.phone_placeholder'),
      autoFocus: false,
      required: true,
      maxLength: 12,
      minLength: 10,
      pattern: new RegExp('((\\+84|84|0)[3|5|7|8|9])+([0-9]{8})')
    },
    defaultValue: null
  }

  emailField: FormlyFieldConfig = {
    type: 'input',
    key: 'email',
    className: 'col-3',
    templateOptions: {
      label: this.translate.instant('candidate.model.email'),
      placeholder: this.translate.instant('candidate.model.email_placeholder'),
      maxLength:100,
      required: true,
      pattern: new RegExp("^[\\w-\\+]+(\\.[\\w]+)*@[\\w-]+(\\.[\\w]+)*(\\.[a-z, A-Z]{2,})$"),
    },
    defaultValue: null
  }

  birthDateField: FormlyFieldConfig = {
    type: 'date',
    key: 'birthDate',
    className: 'col-3',
    defaultValue: null,
    templateOptions: {
      label: this.translate.instant('candidate.model.birth_date'),
      placeholder: this.translate.instant('candidate.model.birth_date_placeholder'),
      nextMonth: false,
      required: false,
      maxDate: moment().format('DD/MM/YYYY')
    }
  }

  genderField: FormlyFieldConfig = {
    type: 'select',
    key: 'gender',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.gender'),
      noSelectText: this.translate.instant('candidate.model.gender_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null
  }

  nationalField: FormlyFieldConfig = {
    type: 'autocomplete',
    key: 'nationality',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('employees.profile.nationality'),
      placeholder: this.translate.instant('employees.profile.ph_country'),
      autoFocus: false,
      required: true,
      valueKey: 'value',
      labelKey: 'label'
    },
    defaultValue: null
  }

  addressField: FormlyFieldConfig = {
    type: 'input',
    key: 'address',
    className: 'col-6',
    templateOptions: {
      label: this.translate.instant('candidate.model.address'),
      placeholder: this.translate.instant('candidate.model.address_placeholder'),
      maxLength:500,
      required: false
    },
    defaultValue: null
  }

  sourceField: FormlyFieldConfig = {
    type: 'select',
    key: 'source',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.source'),
      noSelectText: this.translate.instant('candidate.model.source_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null
  }

  receiveTimeField: FormlyFieldConfig = {
    type: 'date',
    key: 'receiveTime',
    className: 'col-3',
    defaultValue: null,
    templateOptions: {
      label: this.translate.instant('candidate.model.receive_time'),
      placeholder: this.translate.instant('candidate.model.receive_time_placeholder'),
      nextMonth: false,
      required: false,
      maxDate: moment().format('DD/MM/YYYY')
    }
  }

  jdLinkField: FormlyFieldConfig = {
    type: 'input',
    key: 'jdLink',
    className: 'col-6',
    templateOptions: {
      label: this.translate.instant('candidate.model.jd_link'),
      placeholder: this.translate.instant('candidate.model.jd_link_placeholder'),
      maxLength:500,
      required: false,
      pattern: new RegExp('[(http(s)?):\\/\\/(www\\.)?a-zA-Z0-9@:%._\\+~#=]{2,256}\\.[a-z]{2,6}\\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*)')
    },
    defaultValue: null
  }

  candidateInfoFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        this.fullNameField,
        this.phoneField,
        this.emailField,
        this.birthDateField,
        this.genderField,
        this.nationalField,
        this.addressField,
        this.sourceField,
        this.receiveTimeField,
        this.jdLinkField
      ]
    }
  ];

  candidateInfoForm: FormGroup = new FormGroup({});

  canidateContactFields: FormlyFieldConfig[][] = [];
  canidateContactForms: FormGroup[] = [];
  canidateContactModels: any[] = [];

  contactChannelFields: FormlyFieldConfig[] = [];
  canidateContactIconDeleteFields: FormlyFieldConfig[] = [];
  contactInfoFields: FormlyFieldConfig[] = [];

  applyPositionField: FormlyFieldConfig = {
    type: 'select',
    key: 'applyPosition',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.apply_position'),
      noSelectText: this.translate.instant('candidate.model.apply_position_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null,
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(applyPositionId => {
          if (!applyPositionId || !this.levelField.formControl.value || this.checkLevelLow(this.levelField.formControl.value)) {
            this.uploadAndValidateLevelLow();
          } else {
            this.uploadAndValidateLevelHight(applyPositionId);
          }
        });
      }
    }
  }

  levelField: FormlyFieldConfig = {
    type: 'select',
    key: 'level',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.level'),
      noSelectText: this.translate.instant('candidate.model.level_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null,
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(levelId => {
          if (!levelId || this.checkLevelLow(levelId)) {
            this.uploadAndValidateLevelLow();
          } else {
            this.uploadAndValidateLevelHight(this.applyPositionField.formControl.value);
          }
        });
      }
    }
  }

  oldCompanyField: FormlyFieldConfig = {
    type: 'input',
    key: 'oldCompany',
    className: 'col-6',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.old_company'),
      placeholder: this.translate.instant('candidate.model.old_company_placeholder'),
      autoFocus: false,
      required: false,
      maxLength: 200
    },
    defaultValue: null
  }

  domainField: FormlyFieldConfig = {
    type: 'multiselect',
    key: 'domain',
    className: 'col-3',
    focus: true,
    templateOptions: {
      label: this.translate.instant('candidate.model.domain'),
      placeholder: this.translate.instant('candidate.model.domain_placeholder'),
      required: false,
      separator: ",",
      selectedAsString: true,
    },
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(domains => {
          for(let domain of domains){
            if(domain.value == -1 || domain.toString().includes('-1')){
              this.openPopupAddOtherDomain();
              return;
            }
          }
        });
      }
    }
  }

  startWorkTimeField: FormlyFieldConfig = {
    type: 'month',
    key: 'startWorkTime',
    className: 'col-3',
    defaultValue: null,
    templateOptions: {
      label: this.translate.instant('candidate.model.start_work_time'),
      placeholder: this.translate.instant('candidate.model.start_work_time_placeholder'),
      nextMonth: false,
      required: false
    },
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(startWorkTime => {
          this.timeWorkExperienceField.formControl.setValue(this.caculatorWorkExperience(startWorkTime));
        });
      }
    }
  }

  timeWorkExperienceField: FormlyFieldConfig = {
    type: 'input',
    key: 'timeWorkExperience',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.time_work_experience'),
      placeholder: '',
      autoFocus: false,
      required: false,
      readonly: true,
      disabled: true
    },
    defaultValue: null
  }

  certificateField: FormlyFieldConfig = {
    type: 'multiselect',
    key: 'certificate',
    className: 'col-3',
    focus: true,
    templateOptions: {
      label: this.translate.instant('candidate.model.certificate'),
      placeholder: this.translate.instant('candidate.model.certificate_placeholder'),
      required: false,
      separator: ",",
      selectedAsString: true
    },
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(certificates => {
          for(let certificate of certificates){
            if(certificate.value == -1 || certificate.toString().includes('-1')){
              this.openPopupAddOtherCertificate();
              return;
            }
          }
        });
      }
    }
  }

  technologyField: FormlyFieldConfig = {
    type: 'select',
    key: 'technology',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.technology'),
      noSelectText: this.translate.instant('candidate.model.technology_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null,
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(technologyId => {
          if(technologyId == -1){
            this.openPopupAddOtherTechnology();
          }
        });
      }
    }

  }

  startTechnologyTimeField: FormlyFieldConfig = {
    type: 'month',
    key: 'startTechnologyTime',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.start_technology_time'),
      placeholder: this.translate.instant('candidate.model.start_technology_time_placeholder'),
      autoFocus: false,
      required: false,
      readonly: false
    },
    hooks: {
      onInit: (field) => {
        field.formControl.valueChanges.subscribe(startTechnologyTime => {
          this.technologyTimeWorkExperienceField.formControl.setValue(this.caculatorWorkExperience(startTechnologyTime));
        });
      }
    },
    defaultValue: null
  }

  technologyTimeWorkExperienceField: FormlyFieldConfig = {
    type: 'input',
    key: 'technologyTimeWorkExperience',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.technology_time_work_experience'),
      placeholder: '',
      autoFocus: false,
      required: true,
      readonly: true,
      disabled: true
    },
    defaultValue: null
  }


  candidateWorkingExperienceFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        this.applyPositionField,
        this.levelField,
        this.oldCompanyField,
        this.domainField,
        this.startWorkTimeField,
        this.timeWorkExperienceField,
        this.certificateField,
        this.technologyField,
        this.startTechnologyTimeField,
        this.technologyTimeWorkExperienceField
      ]
    }
  ];
  workingExperienceModel: any = {
    status: null,
    domain: null,
    certificate: null,
    applyPosition: null,
    technology: null,
    oldCompany: null,
    startWorkTime: null,
    startTechnologyTime: null
  };

  candidateWorkingExperienceForm: FormGroup = new FormGroup({});

  maxLiteracyField: FormlyFieldConfig = {
    type: 'select',
    key: 'maxLiteracy',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.max_literacy'),
      noSelectText: this.translate.instant('candidate.model.max_literacy_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null
  }

  literacyEnglishField: FormlyFieldConfig = {
    type: 'select',
    key: 'literacyEnglish',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.literacy_english'),
      noSelectText: this.translate.instant('candidate.model.literacy_english_placeholder'),
      autoFocus: false,
      required: true
    },
    defaultValue: null
  }

  educationalInformationFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        this.maxLiteracyField,
        this.literacyEnglishField
      ]
    }
  ];
  educationalInformationModel: any = {
    maxLiteracy: '',
    literacyEnglish: null
  };
  educationalInformationForm: FormGroup = new FormGroup({});


  trainingHistoryFields: FormlyFieldConfig[][] = [];
  schoolFields: FormlyFieldConfig[] = [];
  majorsFields: FormlyFieldConfig[] = [];
  graduateYearFields: FormlyFieldConfig[] = [];
  iconDeleteTrainingHistoryFields: FormlyFieldConfig[] = [];
  trainingHistoryForms: FormGroup[] = [];
  trainingHistoryModels: any[] = [];

  trainingHistoryKeys: number[] = [];
  trainingHistoryItem: number = 0;


  catalogItemStatus: CatalogItemModel[] = [];
  catalogItemGender: CatalogItemModel[] = [];
  catalogItemSource: CatalogItemModel[] = [];
  catalogItemApplyPosition: CatalogItemModel[] = [];
  catalogItemContactChannel: CatalogItemModel[] = [];
  catalogItemLevel: CatalogItemModel[] = [];
  catalogItemDomain: CatalogItemModel[] = [];
  catalogItemCertificate: CatalogItemModel[] = [];
  catalogItemTechnology: CatalogItemModel[] = [];
  catalogItemLiteracy: CatalogItemModel[] = [];
  catalogItemLiteracyEnglish: CatalogItemModel[] = [];

  uploadCVSubject = new BehaviorSubject<Number>(0);
  candidateFileCvUploads: CandidateFileModel[] = [];
  fileCVs: any[] = [];
  fileCVUploads: any[] = [];
  requiredFileCV: boolean = true;

  modalRef: BsModalRef;
  countOpenPopupOther: number = 0;

  @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;

  ngOnInit() {
    this.onInitCandidateStatus();
    this.onInitCandidateGender();
    this.onAddCandidateContact();
    this.onInitCandidateSource();
    this.onInitCandidateApplyPosition();
    this.onInitCandidateLevel();
    this.onInitCandidateDomain();
    this.onInitCandidateCertificate();
    this.onInitCandidateTechnology();
    this.onInitCandidateMaxLiteracy();
    this.onInitCandidateLiteracyEnglish();
    this.onAddTrainingHistory();

    this.uploadCVSubject.subscribe(data=>{
      if (this.candidateFileCvUploads.length == this.fileCVUploads.length && this.fileCVUploads.length > 0) {
        this.onAddCandidate();
      }
    });
  }

  addCandidate() {
    this.candidateStatusForm.markAllAsTouched();
    this.candidateInfoForm.markAllAsTouched();
    for (let contactForm of this.canidateContactForms) {
      contactForm.markAllAsTouched();
    }
    this.candidateWorkingExperienceForm.markAllAsTouched();
    this.educationalInformationForm.markAllAsTouched();
    for (let trainingHistoryForm of this.trainingHistoryForms) {
      trainingHistoryForm.markAllAsTouched();
    }

    if (this.candidateStatusForm.invalid) {
      return;
    }
    if (this.candidateInfoForm.invalid) {
      return;
    }
    for (let contactForm of this.canidateContactForms) {
      if (contactForm.invalid) {
        return;
      }
    }
    if (this.candidateWorkingExperienceForm.invalid) {
      return;
    }
    if (this.educationalInformationForm.invalid) {
      return;
    }
    for (let trainingHistoryForm of this.trainingHistoryForms) {
      if(trainingHistoryForm.invalid){
        return;
      }
    }

    if (this.requiredFileCV && this.fileCVUploads.length == 0) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.file_cv_not_exits'),
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }

    for (let tranning of this.trainingHistoryModels) {
      if (tranning.graduateYear) {
        if (this.now.toDate().getFullYear() > CONFIG.CANDIDATE.MIN_GRADUATE_YEAR + tranning.graduateYear.getFullYear()) {
          this.toastrMessage.showMessageError(null,
              this.translate.instant('candidate.message.graduate_year_min_date',
                  {minSizeYear: CONFIG.CANDIDATE.MIN_GRADUATE_YEAR}),
              this.translate.instant('shared.common-dialog.warning.title'));
          return;
        }
        if (this.now.toDate().getFullYear() < tranning.graduateYear.getFullYear() - CONFIG.CANDIDATE.MAX_GRADUATE_YEAR) {
          this.toastrMessage.showMessageError(null,
              this.translate.instant('candidate.message.graduate_year_max_date',
                  {maxSizeYear: CONFIG.CANDIDATE.MAX_GRADUATE_YEAR}),
              this.translate.instant('shared.common-dialog.warning.title'));
          return;
        }
      }

      if(!this.validateTrainingHistory(tranning)){
        this.toastrMessage.showMessageError(null,
            this.translate.instant('candidate.message.training_history_error'),
            this.translate.instant('shared.common-dialog.warning.title'));
        return;
      }

    }

    for (let contact of this.canidateContactModels) {
      let countData = 0;
      if (contact.contractChannel && contact.contractChannel > 0) {
        countData++;
      }
      if (contact.contractInfo && contact.contractInfo.length > 0) {
        countData++;
      }
      if (countData == 1) {
        if (!contact.contractChannel || contact.contractChannel == 0) {

          this.toastrMessage.showMessageError(null,
              this.translate.instant('validations.required',
                  {field: this.translate.instant('candidate.model.contact_channel')}),
              this.translate.instant('shared.common-dialog.warning.title'));
          return;
        }

        if (!contact.contractInfo || contact.contractInfo.length == 0) {
          this.toastrMessage.showMessageError(null,
              this.translate.instant('validations.required',
                  {field: this.translate.instant('candidate.model.contact_info')}),
              this.translate.instant('shared.common-dialog.warning.title'));
          return;
        }
      }
    }

    if (this.workingExperienceModel.startTechnologyTime && (!this.workingExperienceModel.technology || this.workingExperienceModel.technology == 0)) {

      this.toastrMessage.showMessageError(null,
          this.translate.instant('validations.required',
              {field: this.translate.instant('candidate.model.technology')}),
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }

    if (!this.requiredFileCV && this.fileCVUploads.length == 0) {
      this.onAddCandidate();
    } else {
      this.onUploadCV();
    }
  }

  comeBackCandidateList() {
    this.confirmDialog.openModal(null, null, {
      title: 'candidate.confirm.comeback.title',
      btnConfirm: 'candidate.btn.yes',
      type: NotifyType.warn,
      message: 'candidate.confirm.comeback.message'
    });
  }


  ngOnDestroy(): void {
  }

  onBlurSearch(fieldName: string) {
    if(this.candidateStatusForm.value && typeof this.candidateStatusForm.value[fieldName] == "string"){
      this.candidateStatusForm.setValue({ ...this.candidateStatusForm.value, [fieldName]: this.candidateStatusForm.value[fieldName].trim() });
    }
  }

  onKeypress(event) {
    if(event.keyCode == 13){
    }
  }

  onSubmitAssingee() {

  }


  onAddCandidateContact() {
    let contractInfoField: FormlyFieldConfig = {
      type: 'input',
      key: 'contractInfo',
      className: 'col-3',
      focus: false,
      templateOptions: {
        label: this.translate.instant('candidate.model.contact_info'),
        placeholder: this.translate.instant('candidate.model.contact_info_placeholder'),
        autoFocus: false,
        required: true
      },
      defaultValue: null
    }

    let contractChannelField: FormlyFieldConfig = {
      type: 'select',
      key: 'contractChannel',
      className: 'col-3',
      focus: false,
      templateOptions: {
        label: this.translate.instant('candidate.model.contact_channel'),
        noSelectText: this.translate.instant('candidate.model.contact_channel_placeholder'),
        autoFocus: false,
        required: true
      },
      defaultValue: null,
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(contractChannelId => {
            if (contractChannelId > 0 && this.checkDuplicateContactChannel(contractChannelId)) {
              this.toastrMessage.showMessageError(null,
                  this.translate.instant('candidate.message.duplicate_contact_channel'),
                  this.translate.instant('shared.common-dialog.warning.title'));
              field.formControl.setValue(null);
            }
            if (this.checkContactChannelPhoneOrZalo(contractChannelId)) {
              contractInfoField.templateOptions.pattern = new RegExp('((\\+84|84|0)|[3|5|7|8|9])+([0-9]{8})');
              contractInfoField.formControl?.updateValueAndValidity();
            } else {
              contractInfoField.templateOptions.maxLength = 500;
              contractInfoField.templateOptions.minLength = 0;
              contractInfoField.templateOptions.pattern = '';
              contractInfoField.formControl?.updateValueAndValidity();
            }
          });
        }
      }
    }

    this.contactChannelFields.push(contractChannelField);

    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_CONTACT).subscribe(data => {
      if (data.status.success) {
        this.catalogItemContactChannel = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemContactChannel) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      contractChannelField.templateOptions.options = dataOptions;
    });

    this.contactInfoFields.push(contractInfoField);
    this.candidateContactItem++;
    this.candidateContactKeys.push(this.candidateContactItem);

    let iconDeleteField: FormlyFieldConfig = {
      type: 'iconDelete',
      key: 'iconDelete',
      className: 'col-1',
      focus: false,
      templateOptions: {
        hidden: false
      },
      defaultValue: this.candidateContactItem,
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(res => {
            this.onRemoveCandidateContact(res);
          });
        }
      }
    }

    let canidateContractField: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          contractChannelField,
          contractInfoField,
          iconDeleteField
        ]
      }
    ];

    this.canidateContactFields.push(canidateContractField);

    this.canidateContactIconDeleteFields.push(iconDeleteField);

    let canidateContractForm: FormGroup = new FormGroup({});
    this.canidateContactForms.push(canidateContractForm);

    let candidateContact: any = {
      contractChannel: null,
      contractInfo: ""
    };
    this.canidateContactModels.push(candidateContact);

    if (this.statusField.formControl) {
      this.uploadAndReloadStatus(this.statusField.formControl.value);
    }

    this.updateAndRemoveCandidateContactFirst();
  }

  onRemoveCandidateContact(key: number) {
    let index = -1;
    for (let i = 0; i < this.candidateContactKeys.length; i++) {
      if (this.candidateContactKeys[i] == key) {
        index = i;
      }
    }
    if (index == -1) {
      return;
    }
    this.canidateContactModels.splice(index, 1);
    this.canidateContactFields.splice(index, 1);
    this.canidateContactForms.splice(index, 1);
    this.contactChannelFields.splice(index, 1);
    this.contactInfoFields.splice(index, 1);
    this.candidateContactKeys.splice(index, 1);
    this.canidateContactIconDeleteFields.splice(index, 1);
    this.updateAndRemoveCandidateContactFirst();
  }

  onInitCandidateGender() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_GENDER).subscribe(data => {
      if (data.status.success) {
        this.catalogItemGender = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemGender) {
        let optionStatus: any = {
          value: item.code,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.genderField.templateOptions.options = dataOptions;
    });
  }

  private caculatorWorkExperience(month: string): string {
    if (!month) {
      return '';
    }
    let dateMonth: Date = DateTimeUtils.parser(month);
    let dateNow: Date = this.now.toDate();
    let periodMonth = dateNow.getMonth() - dateMonth.getMonth() + 1 + (dateNow.getFullYear() - dateMonth.getFullYear()) * 12;
    let periodYear: number = (periodMonth - periodMonth % 12) / 12;
    periodMonth = periodMonth % 12;
    let message: string = '';
    if (periodYear == 0 && periodMonth == 0) {
      return message;
    }
    if (periodYear > 0) {
      message = message + periodYear + ' ' + this.translate.instant('candidate.title.year');
    }
    if (periodMonth > 0) {
      if (message.length > 0) {
        message = message + ' ';
      }
      message = message + periodMonth + ' ' + this.translate.instant('candidate.title.month');
    }
    return message;
  }

  onRemoveTrainingHistory(key: number) {
    let index = -1;
    for (let i = 0; i < this.trainingHistoryKeys.length; i++) {
      if (this.trainingHistoryKeys[i] == key) {
        index = i;
      }
    }
    if (index == -1) {
      return;
    }
    this.trainingHistoryModels.splice(index, 1);
    this.trainingHistoryFields.splice(index, 1);
    this.trainingHistoryForms.splice(index, 1);
    this.schoolFields.splice(index, 1);
    this.majorsFields.splice(index, 1);
    this.graduateYearFields.splice(index, 1);
    this.iconDeleteTrainingHistoryFields.splice(index, 1);
    this.trainingHistoryKeys.splice(index, 1);
    this.updateAndRemoveTrainingHistoryFirst();
  }

  onAddTrainingHistory() {
    let majorsField: FormlyFieldConfig = {
      type: 'select',
      key: 'majors',
      className: 'col-3',
      focus: false,
      templateOptions: {
        label: this.translate.instant('candidate.model.majors'),
        noSelectText: this.translate.instant('candidate.model.majors_placeholder'),
        autoFocus: false,
        required: true
      },
      defaultValue: null,
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(majorsId => {
            if (majorsId == -1 && schoolField.formControl.value > 0) {
              this.openPopupAddOtherMajors(schoolField, majorsField);
            }
            if (majorsId > 0 && this.checkDuplicateTraningHistory(majorsId)) {
              this.toastrMessage.showMessageError(null,
                  this.translate.instant('candidate.message.duplicate_traning_history'),
                  this.translate.instant('shared.common-dialog.warning.title'));
              field.formControl.setValue(null);
            }
          });
        }
      }
    }

    let schoolField: FormlyFieldConfig = {
      type: 'select',
      key: 'school',
      className: 'col-3',
      focus: false,
      templateOptions: {
        label: this.translate.instant('candidate.model.school'),
        noSelectText: this.translate.instant('candidate.model.school_placeholder'),
        autoFocus: false,
        required: true
      },
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(schoolId => {
            if (schoolId == -1) {
              this.openPopupAddOtherSchool(schoolField);
            }
            if (schoolId > 0) {
              this.updatemajorsDataBySchool(majorsField, schoolId);
            } else {
              majorsField.templateOptions.options = [];
              majorsField.formControl.reset();
            }
          });
        },
        defaultValue: null
      }
    }

    this.updateSchoolFieldData(schoolField);

    let graduateYearField: FormlyFieldConfig = {
      type: 'year',
      key: 'graduateYear',
      className: 'col-3',
      defaultValue: null,
      templateOptions: {
        label: this.translate.instant('candidate.model.graduate_year'),
        placeholder: this.translate.instant('candidate.model.graduate_year_placeholder'),
        nextMonth: false,
        required: true,
        maxDate: moment().format('YYYY')
      }
    }

    this.trainingHistoryItem++;
    this.trainingHistoryKeys.push(this.trainingHistoryItem);

    let iconDeleteField: FormlyFieldConfig = {
      type: 'iconDelete',
      key: 'iconDelete',
      className: 'col-1',
      focus: false,
      defaultValue: this.trainingHistoryItem,
      templateOptions: {
        hidden: false
      },
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(res => {
            this.onRemoveTrainingHistory(res);
          });
        }
      }
    }


    let trainingHistoryField: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          schoolField,
          majorsField,
          graduateYearField,
          iconDeleteField
        ]
      }
    ];

    this.schoolFields.push(schoolField);
    this.majorsFields.push(majorsField);
    this.graduateYearFields.push(graduateYearField);
    this.iconDeleteTrainingHistoryFields.push(iconDeleteField);

    this.trainingHistoryFields.push(trainingHistoryField);

    let trainingHistoryForm: FormGroup = new FormGroup({});
    this.trainingHistoryForms.push(trainingHistoryForm);

    let trainingHistoryModel: any = {

    };
    this.trainingHistoryModels.push(trainingHistoryModel);

    if (this.statusField.formControl) {
      this.uploadAndReloadStatus(this.statusField.formControl.value);
    }

    this.updateAndRemoveTrainingHistoryFirst();
  }

  onInitCandidateStatus() {
    this.catalogItemService.getStatusList().subscribe(data => {
      if (data.status.success) {
        this.catalogItemStatus = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemStatus) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
        if (item.code == CONFIG.CANDIDATE.STATUS_CODE_R3) {
          this.statusField.formControl.setValue(item.item_id);
        }
      }
      this.statusField.templateOptions.options = dataOptions;
      this.statusField.formControl.updateValueAndValidity();
    });
  }

  onInitCandidateSource() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_SOURCE).subscribe(data => {
      if (data.status.success) {
        this.catalogItemSource = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemSource) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.sourceField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateApplyPosition() {
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
      this.applyPositionField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateLevel() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_LEVEL).subscribe(data => {
      if (data.status.success) {
        this.catalogItemLevel = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemLevel) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.levelField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateDomain() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_DOMAIN).subscribe(data => {
      if (data.status.success) {
        this.catalogItemDomain = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemDomain) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.addOptionOther(dataOptions);
      this.domainField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateCertificate() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_CERTIFICATE).subscribe(data => {
      if (data.status.success) {
        this.catalogItemCertificate = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemCertificate) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.addOptionOther(dataOptions);

      this.certificateField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateTechnology() {
    this.catalogItemService.getItems(CATALOG_ITEM.TECHNOLOGY).subscribe(data => {
      if (data.status.success) {
        this.catalogItemTechnology = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemTechnology) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.addOptionOther(dataOptions);
      this.technologyField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateMaxLiteracy() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_LITERACY).subscribe(data => {
      if (data.status.success) {
        this.catalogItemLiteracy = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemLiteracy) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.maxLiteracyField.templateOptions.options = dataOptions;
      this.maxLiteracyField.formControl.reset();
    });
  }

  onInitCandidateLiteracyEnglish() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_LITERACY_ENGLISH).subscribe(data => {
      if (data.status.success) {
        this.catalogItemLiteracyEnglish = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.catalogItemLiteracyEnglish) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.literacyEnglishField.templateOptions.options = dataOptions;
    });
  }

  onUploadCV() {
    this.candidateFileCvUploads = [];
    for (let file of this.fileCVUploads) {
      this.fileService.convertFileToBase64(file.fileContent).subscribe(data => {
        let candidateUploadCvModel: CandidateUploadCvModel = new CandidateUploadCvModel();
        candidateUploadCvModel.email = this.candidateInfoModel.email;
        candidateUploadCvModel.phone = this.candidateInfoModel.phone;
        candidateUploadCvModel.full_name = this.candidateInfoModel.fullName;
        candidateUploadCvModel.file.name = file.fileName;
        candidateUploadCvModel.file.content = data;
        this.candidateService.uploadCV(candidateUploadCvModel).subscribe(data => {
          let candidateFile: CandidateFileModel = new CandidateFileModel();
          candidateFile.file_id = data.data.file_id;
          this.candidateFileCvUploads.push(candidateFile);
          this.uploadCVSubject.next(1);
          data.data.file_id;
        }, error => {
          if (error.error && error.error.status && !error.error.status.success) {
            this.toastrMessage.showMessageError(error.error.status.code,
                error.error.status.message,
                this.translate.instant('shared.common-dialog.warning.title'));
          }
        });
      });
    }
  }

  onChangeFile(event: any[]): void {
    this.fileCVUploads = event;
  }

  acceptComeback() {
    this.router.navigate(['layout/recruitment/candidate']);
  }

  checkStatusSpecial(statusId: number): boolean {
    for (let statusItem of this.catalogItemStatus) {
      if (statusItem.item_id == statusId && CONFIG.CANDIDATE.STATUS_CODE_SPECIAL.includes(statusItem.code)) {
        return true;
      }
    }
    return false;
  }

  uploadAndValidateStatusSpecial() {
    this.phoneField.templateOptions.required = false;
    this.phoneField.formControl?.updateValueAndValidity();

    this.emailField.templateOptions.required = false;
    this.emailField.formControl?.updateValueAndValidity();

    this.genderField.templateOptions.required = false;
    this.genderField.formControl?.updateValueAndValidity();

    for(let contractChannelField of this.contactChannelFields){
      contractChannelField.templateOptions.required = true;
      contractChannelField.formControl?.updateValueAndValidity();
    }

    for(let contractInfoField of this.contactInfoFields){
      contractInfoField.templateOptions.required = true;
      contractInfoField.formControl?.updateValueAndValidity();
    }

    this.requiredFileCV = false;

    this.levelField.templateOptions.required = false;
    this.levelField.formControl?.updateValueAndValidity();

    this.maxLiteracyField.templateOptions.required = false;
    this.maxLiteracyField.formControl?.updateValueAndValidity();

    this.literacyEnglishField.templateOptions.required = false;
    this.literacyEnglishField.formControl?.updateValueAndValidity();

    for(let schoolField of this.schoolFields){
      schoolField.templateOptions.required = false;
      schoolField.formControl?.updateValueAndValidity();
    }

    for(let majorsField of this.majorsFields){
      majorsField.templateOptions.required = false;
      majorsField.formControl?.updateValueAndValidity();
    }

    for(let graduateYearField of this.graduateYearFields){
      graduateYearField.templateOptions.required = false;
      graduateYearField.formControl?.updateValueAndValidity();
    }
  }

  uploadAndValidateStatusNoneSpecial() {
    this.phoneField.templateOptions.required = true;
    this.phoneField.formControl?.updateValueAndValidity();

    this.emailField.templateOptions.required = true;
    this.phoneField.formControl?.updateValueAndValidity();

    this.genderField.templateOptions.required = true;
    this.genderField.formControl?.updateValueAndValidity();

    for (let contractChannelField of this.contactChannelFields) {
      contractChannelField.templateOptions.required = false;
      contractChannelField.formControl?.updateValueAndValidity();
    }

    for (let contractInfoField of this.contactInfoFields) {
      contractInfoField.templateOptions.required = false;
      contractInfoField.formControl?.updateValueAndValidity();
    }

    this.requiredFileCV = true;

    this.levelField.templateOptions.required = true;
    this.levelField.formControl?.updateValueAndValidity();

    this.maxLiteracyField.templateOptions.required = true;
    this.maxLiteracyField.formControl?.updateValueAndValidity();

    this.literacyEnglishField.templateOptions.required = true;
    this.literacyEnglishField.formControl?.updateValueAndValidity();

    for (let schoolField of this.schoolFields) {
      schoolField.templateOptions.required = true;
      schoolField.formControl?.updateValueAndValidity();
    }

    for (let majorsField of this.majorsFields) {
      majorsField.templateOptions.required = true;
      majorsField.formControl?.updateValueAndValidity();
    }

    for (let graduateYearField of this.graduateYearFields) {
      graduateYearField.templateOptions.required = true;
      graduateYearField.formControl?.updateValueAndValidity();
    }
  }

  checkLevelLow(levelId: number): boolean {
    for (var levelItem of this.catalogItemLevel) {
      if (levelItem.item_id == levelId && CONFIG.CANDIDATE.LEVEL_CODE_LOW.includes(levelItem.code)) {
        return true;
      }
    }
    return false;
  }

  uploadAndValidateLevelLow() {
    this.oldCompanyField.templateOptions.required = false;
    this.oldCompanyField.formControl?.updateValueAndValidity();

    this.startWorkTimeField.templateOptions.required = false;
    this.startWorkTimeField.formControl?.updateValueAndValidity();

    this.timeWorkExperienceField.templateOptions.required = false;
    this.timeWorkExperienceField.formControl?.updateValueAndValidity();

    this.uploadAndValidateApplyPositionNoneDeveloper();
    if (this.checkApplyPositionDeveloper(this.applyPositionField.formControl.value)) {
      this.technologyField.templateOptions.required = true;
      this.technologyField.formControl?.updateValueAndValidity();
    }
  }

  uploadAndValidateLevelHight(applyPositionId: number) {
    this.oldCompanyField.templateOptions.required = true;
    this.oldCompanyField.formControl?.updateValueAndValidity();

    this.startWorkTimeField.templateOptions.required = true;
    this.startWorkTimeField.formControl?.updateValueAndValidity();

    this.timeWorkExperienceField.templateOptions.required = true;
    this.timeWorkExperienceField.formControl?.updateValueAndValidity();

    if(this.checkApplyPositionDeveloper(applyPositionId)){
      this.uploadAndValidateApplyPositionDeveloper();
    } else {
      this.uploadAndValidateApplyPositionNoneDeveloper();
    }
  }

  checkApplyPositionDeveloper(applyPositionId: number): boolean {
    for (var applyPositionItem of this.catalogItemApplyPosition) {
      if (applyPositionItem.item_id == applyPositionId
          && CONFIG.CANDIDATE.APPLY_POSITION_CODE_DEVELOPER == applyPositionItem.code) {
        return true;
      }
    }
    return false;
  }

  uploadAndValidateApplyPositionDeveloper() {
    this.technologyField.templateOptions.required = true;
    this.technologyField.formControl?.updateValueAndValidity();

    this.startTechnologyTimeField.templateOptions.required = true;
    this.startTechnologyTimeField.formControl?.updateValueAndValidity();

    this.technologyTimeWorkExperienceField.templateOptions.required = true;
    this.technologyTimeWorkExperienceField.formControl?.updateValueAndValidity();

  }

  uploadAndValidateApplyPositionNoneDeveloper() {
    this.technologyField.templateOptions.required = false;
    this.technologyField.formControl?.updateValueAndValidity();

    this.startTechnologyTimeField.templateOptions.required = false;
    this.startTechnologyTimeField.formControl?.updateValueAndValidity();

    this.technologyTimeWorkExperienceField.templateOptions.required = false;
    this.technologyTimeWorkExperienceField.formControl?.updateValueAndValidity();
  }

  checkDuplicateContactChannel(contactChannelId: number) {
    let countContactChannel = 0;
    for (var contactChannelField of this.contactChannelFields) {
      if (contactChannelField.formControl.value == contactChannelId) {
        countContactChannel++;
      }
    }
    if (countContactChannel > 1) {
      return true;
    }
    return false;
  }

  checkExistAddContactChannel() {
    if (this.contactChannelFields.length < CONFIG.CANDIDATE.MAX_CONTACT_CHANNEL) {
      return true;
    }
    return false;
  }

  checkExistAddTrainingHistory() {
    if (this.trainingHistoryFields.length < CONFIG.CANDIDATE.MAX_TRAINING_HISTORY) {
      return true;
    }
    return false;
  }

  checkDuplicateTraningHistory(majorId: number) {
    let countMajor = 0;
    for (var majorsField of this.majorsFields) {
      if (majorId == majorsField.formControl.value) {
        countMajor++;
      }
    }
    if (countMajor > 1) {
      return true;
    }
    return false;
  }

  private uploadAndReloadStatus(statusId: number){
    if (this.checkStatusSpecial(statusId)) {
      this.uploadAndValidateStatusSpecial();
    } else {
      this.uploadAndValidateStatusNoneSpecial();
    }
  }

  private openPopupAddOtherDomain() {
    this.countOpenPopupOther++;
    if (this.countOpenPopupOther == 1) {
      this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
        initialState: {
          catalogCode: CATALOG_ITEM.CANDIDATE_DOMAIN,
          otherItem: this.translate.instant('candidate.model.domain_other'),
          titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
              {itemName: this.translate.instant('candidate.model.domain_other').toLowerCase()})
        },
        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
        ignoreBackdropClick: true,
        keyboard: false
      });

      if (this.modalRef) {
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
          if (res.item_id > 0) {
            this.removeOtherOfCandidateDomain();
            let domainValue = this.domainField.formControl.value;
            domainValue.push({value: res.item_id, label: res.name});
            this.domainField.formControl.setValue(domainValue);
            this.domainField.formControl.markAllAsTouched();
            this.onInitCandidateDomain();
            this.countOpenPopupOther = 0;
          }
        });
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
          if (res) {
            this.removeOtherOfCandidateDomain();
            this.domainField.formControl.markAllAsTouched();
            this.onInitCandidateDomain();
            this.countOpenPopupOther = 0;
          }
        });
      }
    }
  }

  private removeOtherOfCandidateDomain(){
    let domainValue = this.domainField.formControl.value;
    let indexRemove = 0;
    for (let index = 0; index < domainValue.length; index++) {
      if (domainValue[index].value == -1) {
        indexRemove = index;
      }
    }
    domainValue.splice(indexRemove, 1);
    this.domainField.formControl.setValue(domainValue);
  }

  private openPopupAddOtherCertificate() {
    this.countOpenPopupOther++;
    if (this.countOpenPopupOther == 1) {
      this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
        initialState: {
          catalogCode: CATALOG_ITEM.CANDIDATE_CERTIFICATE,
          otherItem: this.translate.instant('candidate.model.certificate'),
          titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
              {itemName: this.translate.instant('candidate.model.certificate').toLowerCase()})
        },
        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
        ignoreBackdropClick: true,
        keyboard: false
      });

      if (this.modalRef) {
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
          if (res.item_id > 0) {
            this.removeOtherOfCandidateCertificate();
            let certificateValue = this.certificateField.formControl.value;
            certificateValue.push({value: res.item_id, label: res.name});
            this.certificateField.formControl.setValue(certificateValue);
            this.certificateField.formControl.markAllAsTouched();
            this.onInitCandidateCertificate();
            this.countOpenPopupOther = 0;
          }
        });
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
          if (res) {
            this.removeOtherOfCandidateCertificate();
            this.certificateField.formControl.markAllAsTouched();
            this.onInitCandidateCertificate();
            this.countOpenPopupOther = 0;
          }
        });
      }
    }
  }

  private removeOtherOfCandidateCertificate() {
    let certificateValue = this.certificateField.formControl.value;
    let indexRemove = 0;
    for (let index = 0; index < certificateValue.length; index++) {
      if (certificateValue[index].value == -1) {
        indexRemove = index;
      }
    }
    certificateValue.splice(indexRemove, 1);
    this.certificateField.formControl.setValue(certificateValue);
  }

  private openPopupAddOtherTechnology() {
    this.countOpenPopupOther++;
    if (this.countOpenPopupOther == 1) {
      this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
        initialState: {
          catalogCode: CATALOG_ITEM.TECHNOLOGY,
          otherItem: this.translate.instant('candidate.model.technology'),
          titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
              {itemName: this.translate.instant('candidate.model.technology').toLowerCase()})
        },
        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
        ignoreBackdropClick: true,
        keyboard: false
      });

      if (this.modalRef) {
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
          if (res.item_id > 0) {
            this.technologyField.formControl.setValue(res.item_id);
            this.technologyField.formControl.markAllAsTouched();
            this.onInitCandidateTechnology();
            this.countOpenPopupOther = 0;
          }
        });
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
          if (res) {
            this.technologyField.formControl.setValue(null);
            this.technologyField.formControl.markAllAsTouched();
            this.countOpenPopupOther = 0;
          }
        });
      }
    }
  }

  private openPopupAddOtherSchool(schoolField: FormlyFieldConfig) {
    this.countOpenPopupOther++;
    if (this.countOpenPopupOther == 1) {
      this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
        initialState: {
          catalogCode: CATALOG_ITEM.CANDIDATE_SCHOOL,
          otherItem: this.translate.instant('candidate.model.school'),
          titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
              {itemName: this.translate.instant('candidate.model.school').toLowerCase()})
        },
        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
        ignoreBackdropClick: true,
        keyboard: false
      });

      if (this.modalRef) {
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
          if (res.item_id > 0) {
            schoolField.formControl.setValue(res.item_id);
            schoolField.formControl.markAllAsTouched();
            for (let schoolFieldItem of this.schoolFields) {
              this.updateSchoolFieldData(schoolFieldItem);
            }
            this.countOpenPopupOther = 0;
          }
        });
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
          if (res) {
            schoolField.formControl.setValue(null);
            schoolField.formControl.markAllAsTouched();
            this.countOpenPopupOther = 0;
          }
        });
      }
    }
  }

  private openPopupAddOtherMajors(schoolField: FormlyFieldConfig, majorsField: FormlyFieldConfig) {
    this.countOpenPopupOther++;
    if (this.countOpenPopupOther == 1) {
      this.modalRef = this.modalService.show(CandidateAddOtherItemComponent, {
        initialState: {
          catalogCode: CATALOG_ITEM.CANDIDATE_MAJORS,
          parentId: schoolField.formControl.value,
          otherItem: this.translate.instant('candidate.model.majors'),
          titleCandidateAddOtherItem: this.translate.instant('candidate.add_item_other.title',
              {itemName: this.translate.instant('candidate.model.majors').toLowerCase()})
        },
        class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
        ignoreBackdropClick: true,
        keyboard: false
      });

      if (this.modalRef) {
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdSuccess.subscribe((res: CatalogItemModel) => {
          if (res.item_id > 0) {
            majorsField.formControl.setValue(res.item_id);
            majorsField.formControl.markAllAsTouched();
            for (let index = 0; index < this.majorsFields.length; index++) {
              this.updatemajorsDataBySchool(this.majorsFields[index], this.schoolFields[index].formControl.value);
            }
            this.countOpenPopupOther = 0;
          }
        });
        (<CandidateAddOtherItemComponent>this.modalRef.content).addOtherItemIdHide.subscribe(res => {
          if (res) {
            majorsField.formControl.setValue(null);
            majorsField.formControl.markAllAsTouched();
            this.countOpenPopupOther = 0;
          }
        });
      }
    }
  }

  private updateSchoolFieldData(schoolField: FormlyFieldConfig): void {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_SCHOOL).subscribe(data => {
      let schoolItemModel: CatalogItemModel[] = [];
      if (data.status.success) {
        schoolItemModel = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of schoolItemModel) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.addOptionOther(dataOptions);
      schoolField.templateOptions.options = dataOptions;
    });
  }

  private updatemajorsDataBySchool(majorsField: FormlyFieldConfig, schoolId: number): void {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_MAJORS ,schoolId).subscribe(data => {
      let majorsItemModel: CatalogItemModel[] = [];
      if (data.status.success) {
        majorsItemModel = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of majorsItemModel) {
        let optionStatus: any = {
          value: item.item_id,
          label: item.name
        }
        dataOptions.push(optionStatus);
      }
      this.addOptionOther(dataOptions);
      majorsField.templateOptions.options = dataOptions;
    });
  }

  private onAddCandidate(): void {

    let candidateAddModel: CandidateAddModel = new CandidateAddModel();
    candidateAddModel.status_id = this.statusModel.status;
    candidateAddModel.phone = this.candidateInfoModel.phone;
    candidateAddModel.email = this.candidateInfoModel.email;
    candidateAddModel.gender = this.candidateInfoModel.gender;
    candidateAddModel.nationality = this.candidateInfoModel.nationality
    candidateAddModel.address = this.candidateInfoModel.address;
    candidateAddModel.full_name = this.candidateInfoModel.fullName;
    candidateAddModel.apply_position_id = this.workingExperienceModel.applyPosition;

    if(this.candidateInfoModel.birthDate){
      candidateAddModel.birth_date = this.datePipe.transform(this.candidateInfoModel.birthDate, 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    candidateAddModel.level_id = this.workingExperienceModel.level;
    candidateAddModel.old_company = this.workingExperienceModel.oldCompany;
    if(this.workingExperienceModel.startWorkTime){
      candidateAddModel.start_work_time = this.datePipe.transform(this.workingExperienceModel.startWorkTime, 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    if(this.workingExperienceModel.startTechnologyTime){
      candidateAddModel.start_technology_time = this.datePipe.transform(this.workingExperienceModel.startTechnologyTime, 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    candidateAddModel.max_literacy_id = this.educationalInformationModel.maxLiteracy;
    candidateAddModel.literacy_english_id = this.educationalInformationModel.literacyEnglish;
    candidateAddModel.source_id = this.candidateInfoModel.source;
    candidateAddModel.jd_link = this.candidateInfoModel.jdLink;
    if (this.candidateInfoModel.receiveTime) {
      candidateAddModel.receive_time = this.datePipe.transform(this.candidateInfoModel.receiveTime, 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    candidateAddModel.contacts = [];
    for(let contact of this.canidateContactModels){
      if(contact.contractChannel && contact.contractChannel > 0){
        let candidateContact: CandidateContactModel = new CandidateContactModel();
        candidateContact.contact_id = contact.contractChannel;
        candidateContact.contact_info = contact.contractInfo;
        candidateAddModel.contacts.push(candidateContact);
      }
    }
    candidateAddModel.technology_id = this.workingExperienceModel.technology;
    candidateAddModel.schools = [];

    for (let tranning of this.trainingHistoryModels) {
      if (tranning.majors && tranning.majors > 0) {
        let candidateSchool: CandidateSchoolModel = new CandidateSchoolModel();
        candidateSchool.school_id = tranning.school;
        candidateSchool.majors_id = tranning.majors;
        if (tranning.graduateYear) {
          candidateSchool.graduate_year = this.datePipe.transform(tranning.graduateYear, 'yyyy-MM-dd') + 'T00:00:00Z';
        }
        candidateAddModel.schools.push(candidateSchool);
      }

    }
    candidateAddModel.files = this.candidateFileCvUploads;

    candidateAddModel.domains = [];
    if (typeof this.workingExperienceModel.domain === "string") {
      let domains: string[] = this.workingExperienceModel.domain.split(',');
      for (let domain of domains) {
        if (Number(domain) > 0) {
          let candidateDomainModel: CandidateDomainModel = new CandidateDomainModel();
          candidateDomainModel.domain_id = Number(domain);
          candidateAddModel.domains.push(candidateDomainModel);
        }
      }
    } else {
      let domains: any[] = this.workingExperienceModel.domain;
      for (let domain of domains) {
        if(Number(domain.value)> 0){
          let candidateDomainModel: CandidateDomainModel = new CandidateDomainModel();
          candidateDomainModel.domain_id = Number(domain.value);
          candidateAddModel.domains.push(candidateDomainModel);
        }
      }
    }

    candidateAddModel.certificates = [];
    if (typeof this.workingExperienceModel.certificate === "string") {
      let certificates: string[] = this.workingExperienceModel.certificate.split(',');
      for (let certificate of certificates) {
        if (Number(certificate) > 0) {
          let candidateCertificateModel: CandidateCertificateModel = new CandidateCertificateModel();
          candidateCertificateModel.certificate_id = Number(certificate);
          candidateAddModel.certificates.push(candidateCertificateModel);
        }
      }
    } else {
      let certificates: any[] = this.workingExperienceModel.certificate;
      for (let certificate of certificates) {
        if(Number(certificate.value)> 0){
          let candidateCertificateModel: CandidateCertificateModel = new CandidateCertificateModel();
          candidateCertificateModel.certificate_id = Number(certificate.value);
          candidateAddModel.certificates.push(candidateCertificateModel);
        }
      }
    }

    this.candidateService.add(candidateAddModel).subscribe(data => {
      if(data.status.success){
        this.toastrMessage.showMessageSuccess(data.status.message, this.translate.instant('shared.common-dialog.info.title'));
        window.location.reload();
      }
    }, error => {
      if (error.error && error.error.status && !error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });
  }

  private addOptionOther(dataOptions: any[]) {
    let dataOptionStatusOther: any = {
      value: -1,
      label: this.translate.instant('candidate.add_item_other.other_option')
    };
    dataOptions.push(dataOptionStatusOther);
  }

  checkContactChannelPhoneOrZalo(contactChannelId: number) {
    for (let contactChannel of this.catalogItemContactChannel) {
      if (contactChannel.item_id == contactChannelId &&
          (contactChannel.code == CONFIG.CANDIDATE.CONTACT_PHONE || contactChannel.code == CONFIG.CANDIDATE.CONTACT_ZALO)) {
        return true;
      }
    }
    return false;
  }

  private updateAndRemoveTrainingHistoryFirst() {
    if (this.trainingHistoryKeys.length > 1) {
      this.iconDeleteTrainingHistoryFields[0].templateOptions.hidden = false;
      this.trainingHistoryForms[0].updateValueAndValidity();
    }
    if (this.trainingHistoryKeys.length == 1) {
      this.iconDeleteTrainingHistoryFields[0].templateOptions.hidden = true;
      this.trainingHistoryForms[0].updateValueAndValidity();
    }
  }

  updateAndRemoveCandidateContactFirst() {
    if (this.candidateContactKeys.length > 1) {
      this.canidateContactIconDeleteFields[0].templateOptions.hidden = false;
      this.canidateContactForms[0].updateValueAndValidity();
    }
    if (this.candidateContactKeys.length == 1) {
      this.canidateContactIconDeleteFields[0].templateOptions.hidden = true;
      this.canidateContactForms[0].updateValueAndValidity();
    }
  }

  private validateTrainingHistory(trainingHistoryModel: any): boolean {
    let countValueTraining = 0;
    if (trainingHistoryModel.graduateYear && trainingHistoryModel.graduateYear > 0) {
      countValueTraining++;
    }
    if (trainingHistoryModel.majors && trainingHistoryModel.majors > 0) {
      countValueTraining++;
    }
    if (trainingHistoryModel.school && trainingHistoryModel.school > 0) {
      countValueTraining++;
    }

    return (countValueTraining == 0 || countValueTraining == 3);
  }
}
