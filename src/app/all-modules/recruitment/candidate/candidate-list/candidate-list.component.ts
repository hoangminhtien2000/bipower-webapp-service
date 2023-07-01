import {DatePipe} from "@angular/common";
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {Router} from '@angular/router';
import {FormlyFieldConfig} from "@ngx-formly/core";
import {DataTableDirective} from "angular-datatables";
import * as moment from 'moment';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CatalogItemService} from "src/app/core/services/catalog.item.service";
import {CandidateModel} from "src/app/core/models/candidate.model";
import {CatalogItemModel} from "src/app/core/models/catalog.item.model";
import {CandidateAssignHrComponent} from "../candidate-assign-hr/candidate-assign-hr.component";
import {CandidateService, UserModel, UserService} from "src/app/core";
import {CANDIDATE, CATALOG_ITEM, COMMON, FORMAT_DATE, HOME, MIME_TYPE} from "src/app/core/common/constant";
import {CandidateSearchModel} from "src/app/core/models/candidate.search.model";
import {FileService} from "src/app/core/services/file.service";
import * as FileSaver from 'file-saver';
import {TranslateService} from "@ngx-translate/core";
import {CandidateRequestModel} from "src/app/core/models/candidate.request.model";
import {UserStorage} from "src/app/core/storage/user.storage";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(
    private candidateService: CandidateService,
    private datePipe: DatePipe,
    private router: Router,
    public modalService: BsModalService,
    private catalogItemService: CatalogItemService,
    private translate: TranslateService,
    public userStorage: UserStorage,
    private fileService: FileService,
    private userService: UserService,
    public toastrMessage: ToastrMessageService
  ) {}

  pageSizeOptions: any = [10, 20, 30, 50, 100];
  pageSize = 10;
  page = 1;
  totalRecord = 0;
  constantCandidate = CANDIDATE;
  constantHome = HOME;
  constantCommon = COMMON;

  canidateSearchModel: any = {
    candidateCode: '',
    full_name: '',
    email: '',
    phone: '',
    status: null,
    position: '',
    inChargeUser: null,
    durationCreateDate: [moment().startOf('month').toDate(), moment().endOf('day').toDate()],
    durationOnboard: [null, null]
  }

  candidateCodeField: FormlyFieldConfig = {
    type: 'input',
    key: 'candidateCode',
    className: 'col-3',
    templateOptions: {
      label: this.translate.instant('candidate.model.candidate_code'),
      placeholder: this.translate.instant('candidate.model.candidate_code_placeholder'),
      maxLength:100,
      required: false
    },
    defaultValue: null
  }

  fullNameField: FormlyFieldConfig = {
    type: 'input',
    key: 'fullName',
    className: 'col-2',
    templateOptions: {
      label: this.translate.instant('candidate.model.full_name'),
      placeholder: this.translate.instant('candidate.model.full_name_placeholder'),
      maxLength:100
    },
    defaultValue: null
  }
  birthDateField: FormlyFieldConfig = {
    type: 'year',
    key: 'birthDate',
    className: 'col-2',
    templateOptions: {
      label: this.translate.instant('candidate.model.birth_year'),
      placeholder: this.translate.instant('candidate.model.birth_year_placeholder'),
      nextMonth: false,
      required: false,
      maxDate: moment().format('DD/MM/YYYY')
    }
  }

  phoneField: FormlyFieldConfig = {
    type: 'input',
    key: 'phone',
    className: 'col-2',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.phone'),
      placeholder: this.translate.instant('candidate.model.phone_placeholder'),
      autoFocus: false,
      maxLength: 12
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
      required: false
    },
    defaultValue: null
  }

  durationCreateDateField: FormlyFieldConfig = {
    key: 'durationCreateDate',
    type: 'daterange',
    className: 'col-3',
    templateOptions: {
      label: this.translate.instant('candidate.model.create_date'),
      placeholder: this.translate.instant('candidate.model.create_date_placeholder'),
      required: false
    }
  }
  durationOnboardDateField: FormlyFieldConfig = {
    key: 'durationOnboard',
    type: 'daterange',
    className: 'col-3',
    templateOptions: {
      label: this.translate.instant('candidate.model.onboard_date'),
      placeholder: this.translate.instant('candidate.model.create_date_placeholder'),
      required: false
    }
  }
  applyPositionField: FormlyFieldConfig = {
    type: 'select',
    key: 'applyPosition',
    className: 'col-2',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.apply_position'),
      noSelectText: this.translate.instant('candidate.model.apply_position_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null
  }

  technologyField: FormlyFieldConfig = {
    type: 'select',
    key: 'technology',
    className: 'col-2',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.technology'),
      noSelectText: this.translate.instant('candidate.model.technology_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null
  }

  inChargeUserField: FormlyFieldConfig = {
    type: 'select',
    key: 'inChargeUser',
    className: 'col-2',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.hr_in_charge'),
      noSelectText: this.translate.instant('candidate.model.hr_in_charge_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null
  }

  statusField: FormlyFieldConfig = {
    type: 'select',
    key: 'status',
    className: 'col-3',
    focus: false,
    templateOptions: {
      label: this.translate.instant('candidate.model.status'),
      noSelectText: this.translate.instant('candidate.model.status_placeholder'),
      autoFocus: false,
      required: false
    },
    defaultValue: null
  }

  canidateSearchFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        this.candidateCodeField,
        this.fullNameField,
        this.birthDateField,
        this.phoneField,
        this.emailField,
        this.durationCreateDateField,
        this.applyPositionField,
        this.technologyField,
        this.inChargeUserField,
        this.durationOnboardDateField,
        this.statusField
      ]
    }
  ];

  candidateModels: CandidateModel[] = [];
  catalogItemStatus: CatalogItemModel[] = [];
  catalogItemApplyPosition: CatalogItemModel[] = [];
  catalogItemTechnology: CatalogItemModel[] = [];
  catalogItemGender: CatalogItemModel[] = [];

  searchForm: FormGroup = new FormGroup({});

  userHRs: UserModel[] = [];

  @ViewChild(DataTableDirective, { static: true })
  public addCandidateForm: FormGroup;
  public btnSearchIsClicked = false;
  public checkAll: boolean = false;
  assignHRExists: boolean = true;
  uploadCVExists: boolean = true;
  exportExists: boolean = true;
  importExists: boolean = true;
  isRoleCTV: boolean = false;
  isRoleHR: boolean = false;
  modalRef: BsModalRef;

  onAddNew() {

  }

  ngOnInit() {
    this.onInitCandidateStatus();
    this.onInitCandidateApplyPosition();
    this.onInitCandidateTechnology();
    this.onInitCandidateInChargeUser();
    this.onInitCandidateGender();
    this.onInitExistsAssignHR();
    this.onInitExistsUploadCV();
    this.onInitExistsExport();
    this.onInitExistsImport();
    this.onInitRoleCTV();
    this.onInitRoleHR();
    this.onInitScreenByRole();
  }

  getRequestCandidateSearchModel(){
    let request: CandidateRequestModel = new CandidateRequestModel();
    request.candidate_code = this.canidateSearchModel.candidateCode;
    request.full_name = this.canidateSearchModel.fullName;
    request.email = this.canidateSearchModel.email;
    request.phone = this.canidateSearchModel.phone;
    if (this.canidateSearchModel.birthDate) {
      request.birth_date = this.datePipe.transform(this.canidateSearchModel.birthDate, 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    if (this.canidateSearchModel.applyPosition) {
      request.apply_position_id = this.canidateSearchModel.applyPosition;
    }
    if (this.canidateSearchModel.technology) {
      request.technology_id = this.canidateSearchModel.technology;
    }
    if (this.canidateSearchModel.status) {
      request.status_id = this.canidateSearchModel.status;
    }
    if (this.canidateSearchModel.inChargeUser) {
      request.in_charge_user_id = this.canidateSearchModel.inChargeUser;
    }
    if (this.canidateSearchModel.durationCreateDate && this.canidateSearchModel.durationCreateDate[0]) {
      request.from_time = this.datePipe.transform(this.canidateSearchModel.durationCreateDate[0], 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    if (this.canidateSearchModel.durationCreateDate && this.canidateSearchModel.durationCreateDate[1]) {
      request.to_time = this.datePipe.transform(this.canidateSearchModel.durationCreateDate[1], 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    if (this.canidateSearchModel.durationOnboard && this.canidateSearchModel.durationOnboard[0]) {
      request.from_estimate_onboard_date = this.datePipe.transform(this.canidateSearchModel.durationOnboard[0], 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    if (this.canidateSearchModel.durationOnboard && this.canidateSearchModel.durationOnboard[1]) {
      request.to_estimate_onboard_date = this.datePipe.transform(this.canidateSearchModel.durationOnboard[1], 'yyyy-MM-dd') + 'T00:00:00Z';
    }
    return request;
  }

  callSearchAndUpdate() {
    let model: CandidateSearchModel = new CandidateSearchModel();
    model.page.page = this.page - 1;
    model.page.page_size = this.pageSize;
    model.request = this.getRequestCandidateSearchModel();
    this.candidateService.search(model).subscribe(data => {
      this.totalRecord = data.data.count;
      this.candidateModels = data.data.items;
    }, error => {
      if (error.error && error.error.status && !error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });
  }

  onClickBtnSearch() {
    this.page = 1;
    this.checkAll = false;
    this.searchForm.markAllAsTouched();
    this.candidateCodeField.formControl.markAllAsTouched();
    this.birthDateField.formControl.markAllAsTouched();
    this.birthDateField.formControl.markAllAsTouched();
    const controls = this.searchForm.controls;
    const invalid = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    this.callSearchAndUpdate();

  }

  onAssignHR() {
    let candidateIds: number[] = [];
    for (let candidateModel of this.candidateModels) {
      if(candidateModel.checked){
        candidateIds.push(candidateModel.candidate_id);
      }
    }
    let numberHR: number = candidateIds.length;
    if (numberHR == 0) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.choose_candidate_assign_hr'),
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }
    this.modalRef = this.modalService.show(CandidateAssignHrComponent, {
      initialState: {candidateIds: candidateIds, numberHR: numberHR},
      class: 'modal-left modal-dialog-centered w-50 max-width-modal expand',
      ignoreBackdropClick: true
    });

    if (this.modalRef) {
      (<CandidateAssignHrComponent>this.modalRef.content).assignHRSuccess.subscribe((res: boolean) => {
        if (res) {
          this.onClickBtnSearch();
        }
      });
    }
  }

  onUploadCV() {
    this.router.navigate(['/layout/recruitment/candidate/upload-cv']);
  }

  onExport() {
    this.searchForm.markAllAsTouched();
    this.candidateCodeField.formControl.markAllAsTouched();
    this.birthDateField.formControl.markAllAsTouched();
    this.birthDateField.formControl.markAllAsTouched();
    const controls = this.searchForm.controls;
    const invalid = [];
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }

    let model: CandidateSearchModel = new CandidateSearchModel();
    model.request = this.getRequestCandidateSearchModel();
    this.candidateService.export(model).subscribe(res => {
      const data = this.fileService.convertBase64ToBlob(res.data.content, MIME_TYPE.XLSX);
      const fileName = res.data.display_name;
      FileSaver.saveAs(data, fileName);
    }, error => {
      if (error.error && error.error.status && !error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });
  }

  onImport() {
    this.router.navigate(['/layout/recruitment/candidate/import-cv']);
  }

  onAddCandidate() {
    this.router.navigate(['/layout/recruitment/candidate/add']);
  }

  ngOnDestroy(): void {
  }

  onChangePageSize(page): void {
    this.pageSize = parseInt(page);
    this.checkAll = false;
    this.callSearchAndUpdate();
  }

  onPageChange(page): void {
    this.page = parseInt(page);
    this.checkAll = false;
    this.callSearchAndUpdate();
  }

  updateStatusCheckedAll(value: any = false) {
    if (this.candidateModels && this.candidateModels.length >= 0) {
      this.candidateModels.forEach(element => {
        element.checked = value;
      });
    }
  }

  onClickCheckBox(event: any, index: number) {
    if(index == -1){
        if(event.target.checked == true){
          this.checkAll = true;
          this.updateStatusCheckedAll(true);
        }else{
          this.checkAll = false;
          this.updateStatusCheckedAll(false);
        }
    }else{
      this.candidateModels[index].checked = event.target.checked;
      const finder = this.candidateModels.find(el => !el.checked == true);
      if(finder){
        this.checkAll = false;
      }else{
        this.checkAll = true;
      }

    }
  }

  onInitCandidateStatus() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_STATUS).subscribe(data => {
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
      }
      this.statusField.templateOptions.options = dataOptions;
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
      this.applyPositionField.formControl.updateValueAndValidity();
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
      this.technologyField.templateOptions.options = dataOptions;
      this.technologyField.formControl.updateValueAndValidity();
    });
  }

  onDetailCandidate(candidateModel: CandidateModel) {
    this.candidateService.changeCandidateIdByDetail(candidateModel.candidate_id);
    this.router.navigate(['/layout/recruitment/candidate/detail']);
  }

  ngAfterViewInit(): void {
    this.callSearchAndUpdate();
  }

  onInitCandidateInChargeUser() {
    this.userService.getHRList().subscribe(data => {
      if (data.status.success) {
        this.userHRs = data.data;
      }
      let dataOptions: any[] = [];
      for (var item of this.userHRs) {
        let label: string = item.user_code;
        if (item.full_name && item.full_name.length > 0) {
          label = label + ' - ' + item.full_name;
        }
        let optionInChargeUser: any = {
          value: item.user_id,
          label: label
        }
        dataOptions.push(optionInChargeUser);
      }
      this.inChargeUserField.templateOptions.options = dataOptions;
    });
  }

  onInitCandidateGender() {
    this.catalogItemService.getItems(CATALOG_ITEM.CANDIDATE_GENDER).subscribe(data => {
      if (data.status.success) {
        this.catalogItemGender = data.data;
      }
    });
  }

  getNameGender(genderCode: string): string{
    for (var item of this.catalogItemGender) {
      if(item.code == genderCode){
        return item.name;
      }
    }
    return "";
  }


  getNameHRInCharge(hrIncharge: UserModel): string {
    if(!hrIncharge){
      return '';
    }
    let label: string = hrIncharge.full_name;
    if (hrIncharge.email && hrIncharge.email.length > 0) {
      label = label + ' (' + hrIncharge.email + ')';
    }
    return label;
  }

  onInitExistsAssignHR() {
    this.assignHRExists = this.userStorage.isRoleHRALead() || this.userStorage.isRoleRecruiterLead();
  }

  onInitExistsUploadCV() {
    if(this.userStorage.isRoleHRALead()){
      this.uploadCVExists = true;
      return ;
    }
    if(this.userStorage.isRoleRecruiterLead()){
      this.uploadCVExists = true;
      return ;
    }
    if(this.userStorage.isRoleHR()){
      this.uploadCVExists = true;
      return ;
    }
    this.uploadCVExists = false;
  }

  onInitExistsExport() {
    this.exportExists = this.userStorage.isRoleHRALead() || this.userStorage.isRoleHR() || this.userStorage.isRoleRecruiterLead();
  }

  onInitExistsImport() {
    this.importExists = this.userStorage.isRoleHRALead() || this.userStorage.isRoleHR() || this.userStorage.isRoleRecruiterLead();
  }

  onInitRoleCTV() {
    this.isRoleCTV = this.userStorage.isRoleCTV();
  }

  onInitRoleHR() {
    this.isRoleHR = this.userStorage.isRoleHR();
  }

  onInitScreenByRole(){
    if (this.isRoleCTV) {
      this.canidateSearchFields[0].fieldGroup = [
        this.candidateCodeField,
        this.fullNameField,
        this.birthDateField,
        this.phoneField,
        this.emailField,
        this.durationCreateDateField,
        // this.durationOnboardDateField,
        this.applyPositionField,
        this.technologyField
      ]
    }
  }

}
