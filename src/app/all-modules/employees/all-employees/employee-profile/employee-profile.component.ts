import {DatePipe} from "@angular/common";
import {NgbModal, NgbModalConfig, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, OnInit, ViewChild} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {EmployeeService} from "src/app/core/services/employee.service";
import {environment} from "src/environments/environment";
import {ContractService} from "src/app/core/services/contract.service";
import {EMPLOYEE_STATUS_ENUM, GENDER, STATUS, MIME_TYPE, OT_STATUS, RELATIONSHIP_LIST, ROLE_LIST, URL_IMAGE_PREV} from "../../../../core/common/constant";
import { getAdminUnit } from "src/app/core/services/constant.service";
import { FileService } from "src/app/core/services/file.service";
import * as FileSaver from 'file-saver';
import { CatalogService, CATALOG_CODE } from "src/app/core/services/catalog.service";
import { TeamService } from "src/app/core/services/team.service";
import { EmployeeConfirmI, TeamInfoI, TeamResponseI } from "src/app/core/models/response/employeeResponse.model";
import { OauthService } from "src/app/core/services/oauth.service";
import { RoleResponseI } from "src/app/core/models/response/oauth.response.model";
import { TranslateService } from "@ngx-translate/core";
declare const $: any;

@Component({
    selector: "app-employee-profile",
    templateUrl: "./employee-profile.component.html",
    styleUrls: ["./employee-profile.component.css"]
})
export class EmployeeProfileComponent implements OnInit {
    public addEmployeeForm: FormGroup;
    public rejectEmployeeForm: FormGroup;
    public employeeApproveForm: FormGroup;
    public id: any = null;
    public edit_employee_id = 'edit_employee';
    public bank_information_modal = 'bank-information-modal';
    public identity_information_modal = 'idEntity-information-modal';
    public personal_tax_information_modal = 'personal-tax-information-modal';
    public social_insurance_information_modal = 'social-insurance-information-modal';
    public employee_confirm_approve_modal_id = 'employee_confirm_approve_modal_id';
    public team_role_modal_id = 'team_role_modal_id';

    public permanent_residence_modal = 'permanent-residence-modal';
    public current_address_modal = 'current-address-modal';
    public social_domicile_information_modal = 'social-domicile-information-modal';
    public social_family_information_modal = 'social-family-information-modal';
    public social_formalContract_information_modal = 'social-formalContract-information-modal';
    public storage_profile_modal = 'storage-profile-modal';
    public address_info_modal = 'address-info-modal';
    public contract_modal = 'contract_modal';
    public performance_info_modal = 'performance_info_modal';
    public team_role_modal_edit_id = 'team_role_modal_edit_id';

    public employeeInfo: any = null;
    public employeeSalary: any = null;
    public employeeSalaryEdit: any = null;
    public employeeSalaryChangeStatus: any = {};
    public employeeSalaries: any = [];
    public lstEmployee: [];
    public employeeStatus: string = "";
    public signableNewContract: boolean = true;
    @ViewChild("bankRef") bankRef: any;
    public modalReference: NgbModalRef;
    public imageUrl = environment.imageUrl + "/download-file";
    public domainImage = environment.imageUrl;
    public taxInfo: any = null;
    public taxInfoEdit: any = null;
    public taxInfoChangeStatus: any = {};
    public socialInsurance: any = null;
    public socialInsuranceEdit: any = null;
    public socialInsuranceChangeStatus: any = {};
    public isUpdatedSpecialInfo: false;
    data: any = {};
    public EMPLOYEE_POSITION: any[] = [];
    public EMPLOYEE_STATUS: any[] = [];
    public GENDER: any[] = [];
    public TECHNOLOGY: any[] = [];
    public EMPLOYEE_IDENTITY_TYPE: any[] = [];
    public EMPLOYEE_RELATIONSHIP: any[] = [];
    public oauthRoles: RoleResponseI[] = [];
    public COUNTRY_DEFAULT: string = 'VietNam';
    public QC = [ROLE_LIST.DEVELOPER];
    public teams: TeamInfoI[] = [];
    public isDisplay: boolean = false;
    public maxlength: number = 34;
    roles = JSON.parse(localStorage.getItem('USER_ROLES'));
    companyEmail = JSON.parse(localStorage.getItem('USER_INFO'))?.email;
    public baseUrl = URL_IMAGE_PREV.url;

    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private employeeService: EmployeeService,
        private datePipe: DatePipe,
        private modalService: NgbModal,
        config: NgbModalConfig,
        private contractService: ContractService,
        private fileService: FileService,
        private router: Router,
        private catalogService: CatalogService,
        private teamService: TeamService,
        private oauthService: OauthService,
        private translate: TranslateService
    ) {
        config.backdrop = 'static';
        config.keyboard = false;
    }
    avatarDefault: any = "";
    ngOnInit() {
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_POSITION).subscribe(result => {
            if(result.data){
                this.EMPLOYEE_POSITION = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_STATUS).subscribe(result => {
            if(result.data){
                this.EMPLOYEE_STATUS = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.GENDER).subscribe(result => {
            if(result.data){
                this.GENDER = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.TECHNOLOGY).subscribe(result => {
            if(result.data){
                this.TECHNOLOGY = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_IDENTITY_TYPE).subscribe(result => {
            if(result.data){
                this.EMPLOYEE_IDENTITY_TYPE = result.data;
            }
        })
        this.catalogService.getCatalogs(CATALOG_CODE.EMPLOYEE_RELATIONSHIP).subscribe(result => {
            if(result.data){
                this.EMPLOYEE_RELATIONSHIP = result.data;
            }
        })
        this.loadDataEmployee();
        this.addEmployeeForm = this.formBuilder.group({
            client: ["", [Validators.required]],
        });
        this.rejectEmployeeForm = this.formBuilder.group({
            note: ['', [Validators.required, Validators.maxLength(500)]]
        })
        this.employeeApproveForm = this.formBuilder.group({
            role: ['', [Validators.required]]
        })
        this.loadTeamRoleData();
    }

    getCatalogNameByCode(list: any = [], code: string = ''){
        const finder = list.find(el => el.code == code);
        if(finder){
            return finder.name;
        }
        return "";
    }

    getPositionName(code: string){
        return this.getCatalogNameByCode(this.EMPLOYEE_POSITION, code);
    }

    getTechName(code: string){
        return this.getCatalogNameByCode(this.TECHNOLOGY, code);
    }

    downloadImage(filePath: string, cb: any){
        this.fileService.getFile(Number(filePath)).subscribe(res => {
            cb(res.data);
        });
    }

    getFileImage(path: string, cb: any){
        if(path){
            this.downloadImage(path, (binary) => {
                const fileName = binary.display_name;
                let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
                const result = this.fileService.convertBase64ToBlob(binary.content, "image/" + suff);
                let reader = new FileReader();
                reader.readAsDataURL(result); 
                reader.onloadend = () => {
                    let base64data = reader.result;                
                    this.avatarDefault = base64data;
                }
            });
        }
    }

    clickDownloadFilePdf(path: string){
        this.getFileDownloadPdf(path);
    }

    getFileDownloadPdf(path: string){
        if(path){
            let fileNameSplit = path.split("/");
            let fileName = fileNameSplit[fileNameSplit.length - 1];
            let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
            this.downloadImage(path, (binary) => {
                const result = this.fileService.convertBase64ToBlob(binary, "application/pdf" );
                FileSaver.saveAs(result, fileName);
            });
        }
    }

    getFileDownloadImage(path: string){
        if(path){
            let fileNameSplit = path.split("/");
            let fileName = fileNameSplit[fileNameSplit.length - 1];
            let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
            this.downloadImage(path, (binary) => {
                const result = this.fileService.convertBase64ToBlob(binary, "image/" + suff);
                let reader = new FileReader();
                reader.readAsDataURL(result); 
                reader.onloadend = () => {
                    let base64data:any = reader.result; 
                    // window.open(base64data, '_blank')
                }
                FileSaver.saveAs(result, fileName);
                // FileSaver.saveAs(result, fileName);
            });
        }
    }
    public isShowNormal = true;
    public isShowSocial = true;
    public isShowTaxInfo = true;
    public isEditPerformance = true;
    public isEditTeamRole = true;
    public showStatusTeamRole = false;
    public isShowRejectApprove = false;
    public isSendAppove = false;
    public isAddNewContract = false;
    public teamData: any = [];
    public teamsSelected: any = [];
    public dataEmployee = null;
    public isShowHistory = false;
    get showNormal() {
        return ;
    }
    loadDataEmployee() {
        this.id = this.route.snapshot.queryParams.id;
        this.employeeService.findById(this.id).subscribe(({data}: any) => {
            this.data = data;
            this.employeeInfo = data?.employeeProfile;
            this.employeeSalary = data?.employeeSalary;
            this.employeeSalaryChangeStatus = this.getKeyValueChange(this.employeeSalary, this.employeeSalaryEdit);
            this.employeeStatus = data?.employeeStatus;
            this.addressInfo = data?.employeeProfile?.employeeContact;
            this.signableNewContract = data?.signableNewContract;
            this.isUpdatedSpecialInfo = data?.isUpdatedSpecialInfo;
            this.teamData = data && data.teamData ? data.teamData.map(el => {
                let obj: any = {};
                obj.teamName = el.teamName;
                obj.roles = "";
                for(const key in el.roles){
                    if(!obj.roles){
                        obj.roles += "" + el.roles[key];
                    }else{
                        obj.roles += ", " + el.roles[key];
                    }
                }
                return obj;
            }) : [];
            this.teamsSelected = data?.teamData ? data.teamData : [];
            this.isShowNormal = this.canEditEmployeeInfo();
            this.isShowSocial = this.canEditEmployeeInfo('social-insurance');
            this.isShowTaxInfo = this.canEditEmployeeInfo('tax-info');
            this.isEditPerformance = this.getEditPerformance();
            this.isEditTeamRole = this.getEditTeamRole();
            this.showStatusTeamRole = this.canShowWithStatus('role-team-info');
            this.isShowRejectApprove = this.canRejectApprove();
            this.isSendAppove = this.canSendApprove();
            this.isAddNewContract = this.canAddNewContract();
            this.employeeSalaryEdit = data?.employeeSalaries[0];
            this.employeeSalaries = data?.employeeSalaries;
            this.taxInfoChangeStatus = {};
            if(data?.taxInfoResp?.taxInfo && data.taxInfoResp.taxInfo.length > 0){
                this.taxInfo = data.taxInfoResp.newTaxInfo;
                this.taxInfoEdit = data.taxInfoResp.taxInfo[0];
                this.taxInfoChangeStatus = this.getKeyValueChange(this.taxInfo, this.taxInfoEdit);
            }else {
                this.taxInfo = null;
            }
            this.socialInsuranceChangeStatus = {}
            if(data?.socialInsurances && data.socialInsurances.length > 0){
                this.socialInsurance = data.newSocialInsurance;
                this.socialInsuranceEdit = data.socialInsurances[0];
                this.socialInsuranceChangeStatus = this.getKeyValueChange(this.socialInsurance, this.socialInsuranceEdit);
            }else {
                this.socialInsurance = null;
            }
            if (this.QC.filter(el => this.employeeInfo?.position.indexOf(el) >= 0).length > 0) {
                this.isDisplay = true;
            } else {
                this.isDisplay = false;
            }
            try {
                let avatarFile = this.getCatalogStoredsByCatalog('avatarFile');
                this.getFileImage(avatarFile, () => {});
            } catch (error) {
                
            }
            this.isShowHistory = data?.employeeProfile.companyEmail == this.companyEmail || this.roles.filter(role => role.code == ROLE_LIST.COO || role.code == ROLE_LIST.TEAM_LEADER || role.code == ROLE_LIST.C_B).length > 0;
        }, err => {});
    }

    get gender(){
        try {
            let gender = GENDER.find(el => this.employeeInfo?.gender == el.code);
            if(gender) {
                return gender.key;
            }
        } catch (error) {
            
        }
        return ""
    }

    getStatus(value: string) {
            try {
              let status = this.EMPLOYEE_STATUS.find(
                (el) => this.employeeInfo?.status == el.code
              );
              if (status) {
                return status.name;
              }
            } catch (error) {}
            return "";
          }

    getGender(value: string){
        try {
            let gender = this.GENDER.find(el => value == el.code);
            if(gender) {
                return gender.name;
            }
        } catch (error) {
            
        }
        return ""
    }

    getRelationship(value: string){
        try {
            let rela = this.EMPLOYEE_RELATIONSHIP.find(el => value == el.code);
            if(rela) {
                return rela.name;
            }
        } catch (error) {
            
        }
        return ""
    }

    getEditPerformance() {
        let flag = this.roles.filter(el => el.code == ROLE_LIST.C_B || el.code == ROLE_LIST.COO).length > 0;
        return flag ? flag : 
            [EMPLOYEE_STATUS_ENUM.PENDING, EMPLOYEE_STATUS_ENUM.CONFIRMED]
            .indexOf(this.employeeStatus) >= 0;

    }

    getEditTeamRole() {
        return this.roles.filter(el => el.code == ROLE_LIST.COO).length > 0;
    }

    public addressInfo: any = {};

    async loadOrigin(national: string = 'VietNam', provinceId: number = 0, districtId: number = 0, wardId: number = 0) {
        if (national) {
            this.addressInfo.national = 'VietNam';
            if (provinceId) {
                let province_result = await getAdminUnit(provinceId);
                if(province_result){
                    this.addressInfo.originalProvinceName = province_result.name;
                }
            }
            if (districtId) {
                let district_result = await getAdminUnit(provinceId, districtId);
                if(district_result){
                    this.addressInfo.originalDistrictName = district_result.name;
                }
                
            }
        } else {
            this.addressInfo.national = 'Người nước ngoài';
        }
    }

    async loadPemanent(national: string = 'VietNam', provinceId: number = 0, districtId: number = 0, wardId: number = 0) {
        if (national) {
            this.addressInfo.national = 'VietNam';
            if (provinceId) {
                let province_result = await getAdminUnit(provinceId);
                if(province_result){
                    this.addressInfo.permanentProvinceName = province_result.name;
                }
            }
            if (districtId) {
                let district_result = await getAdminUnit(provinceId, districtId);
                if(district_result){
                    this.addressInfo.permanentDistrictName = district_result.name;
                }
            }
        } else {
            this.addressInfo.national = 'Người nước ngoài';
        }
    }

    async loadCurrent(national: string = 'VietNam', provinceId: number = 0, districtId: number = 0, wardId: number = 0) {
        if (national) {
            this.addressInfo.national = 'VietNam';
            if (provinceId) {
                let province_result = await getAdminUnit(provinceId);
                if(province_result){
                    this.addressInfo.currentProvinceName = province_result.name;
                }
            }
            if (districtId) {
                let district_result = await getAdminUnit(provinceId, districtId);
                if(district_result){
                    this.addressInfo.currentDistrictName =  district_result.name;
                }
            }
            if (wardId) {
                let ward_result = await getAdminUnit(provinceId, districtId, wardId);
                if(ward_result){
                    this.addressInfo.currentWardName = ward_result.name;
                }
            }
        } else {
            this.addressInfo.national = 'Người nước ngoài';
        }
    }

    onSubmit() {
        this.toastr.success("Bank & statutory added", "Success");
    }

    editProfile() {
        $("#" + this.edit_employee_id).modal("show");

    }

    convertStringToDate(birthday: any = '') {
        if (typeof birthday == 'string') {
            const dateSplit = birthday.split('/');
            return new Date(parseInt(dateSplit[2]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[0]))
        }
        return birthday;
    }

    onSaveAddNew(data) {
        const obj = Object.assign({}, data);
        delete obj["cvFile"];
        delete obj["avatarFile"];
        // let listDateName = ["onboardDate", "workingTimeFrom", "workingTimeWithStackFrom", "birthday"];
        let listDateName = ["birthday", "workingTimeFrom", "workingTimeWithStackFrom", "identityCardValidDate", "lastWorkingDate", "onboardDate"];

        let listLongValueName = [];
        for (const key in obj) {
            if (obj[key]) {
                if (listDateName.indexOf(key) >= 0) {
                    obj[key] = this.datePipe.transform(this.convertStringToDate(obj[key]), 'dd/MM/yyyy');
                } else if (listLongValueName.indexOf(key) >= 0) {
                    obj[key] = new Date(obj[key]).getTime();
                }
            } else {
                obj[key] = null;
            }
        }

        const formData: FormData = new FormData();
        formData.append('avatarFile', data.avatarFile ? data.avatarFile : null);
        formData.append('employeeJsonData', JSON.stringify(obj));
        this.employeeService.update(obj, obj.id).subscribe((result: any) => {
            if(result.body){
                const body = result.body;
                if (body && body.success) {
                    $("#" + this.edit_employee_id).modal("hide");
                    this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_staff_info_successfully"));
                    this.loadDataEmployee();
                } else if(body.success == false){
                    this.toastr.error(body.message, "Lỗi");
                }
            }
        }, error => {});
    }

    get isShow() {
        if(this.employeeStatus != EMPLOYEE_STATUS_ENUM.WAITING_CB_APPROVE && this.employeeStatus != 'RETIRED'){
            return true;
        }else{
            if( this.employeeStatus == EMPLOYEE_STATUS_ENUM.PENDING
                || this.employeeStatus == EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE
                || this.employeeStatus == EMPLOYEE_STATUS_ENUM.CONFIRMED
                ){
                    return this.employeeInfo && this.companyEmail == this.employeeInfo.companyEmail
                        && this.employeeInfo.status == EMPLOYEE_STATUS_ENUM.CONFIRMED
            }else{
                return true;
            }
        }

    }

    getCurrentCy(value: any = '0') {
        return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    onClickSendApprove() {
        const body = {
            note: '',
            isApproval: true,
            employeeId: this.id
        }
        this.employeeService.updateStatus(body, this.id).subscribe((result: any) => {
            if (result && result.success) {
                this.toastr.success("Gửi phê duyệt thành công", "Thông báo");
                this.loadDataEmployee();
            } else if(result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {
            this.toastr.error(error.error.error);
        });
    }

    onClickRejectApprove() {
        $('#reject_employee_approve_modal').modal('show');
    }

    cancelRejectApprove() {
        $('#reject_employee_approve_modal').modal('hide');
    }

    onClickSendRejectApprove() {
        this.rejectEmployeeForm.markAllAsTouched();
        if (this.rejectEmployeeForm.valid) {
            const body = {
                note: this.rejectEmployeeForm?.value?.note,
                isApproval: false,
                employeeId: this.id
            }
            this.employeeService.updateStatus(body, this.id).subscribe((result) => {
                if (result && result.success) {
                    this.toastr.success("Đã từ chối phê duyệt.", "Thông báo");
                    $('#reject_employee_approve_modal').modal('hide');
                    this.router.navigate(["/layout/employees/employeelist"])
                } else if(result.success == false){
                    this.toastr.error(result.message, "Lỗi");
                }
            }, error => {
                this.toastr.error(error.error.error);
            });
        }

    }

    loadTeamRoleData() {
        this.teamService.getTeams().subscribe((result: TeamResponseI) => {
            if(result.success){
                this.teams = result.data;
            }else{
                this.teams = [];
            }
        }, error => {});
        this.oauthService.getRoleList().subscribe((result: RoleResponseI[]) => {
            if(result){
                this.oauthRoles = result;
            }else{
                this.oauthRoles = [];
            }
        }, error => {});
    }

    onClickAcceptApprove() {
        let listRoleCode = this.roles.map(role => role.code);
        if(listRoleCode.indexOf(ROLE_LIST.COO) >= 0 && this.employeeStatus == EMPLOYEE_STATUS_ENUM.CB_APPROVED){
            $("#" + this.team_role_modal_id).modal("show");
        }else if(listRoleCode.indexOf(ROLE_LIST.C_B) >= 0 || this.employeeStatus != EMPLOYEE_STATUS_ENUM.CB_APPROVED){
            $("#" + this.employee_confirm_approve_modal_id).modal("show");
        }
    }

    onCbAccept(event: EmployeeConfirmI, modalId) {
        const handleCbAccept = () => $("#" + modalId).modal('hide');
        this.callUpdateStatus({ isApproval: event.isApproval, note: event.note }, handleCbAccept);
    }

    onCooAccept(event: any, modalId) {
        const handleCooAccept = () => $("#" + modalId).modal('hide');
        this.callUpdateStatus(event, handleCooAccept);
    }

    onCooAcceptUpdateTeam(event: any, modalId) {
        event.employeeId = this.id;
        this.employeeService.updateTeamByEmployeeId(event).subscribe((result) => {
            if (result && result.success) {
                this.toastr.success("Phê duyệt thành công", "Thông báo");
                $("#" + modalId).modal('hide');
                this.loadDataEmployee();
            } else  if(result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    callUpdateStatus(data: any, cb: Function): void{
        const body = data;
        this.employeeService.updateStatus(body, this.id).subscribe((result) => {
            if (result && result.success) {
                this.toastr.success("Phê duyệt thành công", "Thông báo");
                if(cb) cb();
                this.loadDataEmployee();
            } else  if(result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    onClickEditBankInfor() {
        $("#" + this.bank_information_modal).modal("show");
    }

    onSubmitBankInfo(data) {
        data = data.map(el => {
            el.employeeId = this.data?.employeeProfile?.id;
            return el;
        })
        this.employeeService.updateBankInfos(data, this.data?.employeeProfile?.id).subscribe(result => {
            if (result && result.success) {
                this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_bank_info_successfully"));
                $('#' + this.bank_information_modal).modal('hide');
                this.loadDataEmployee();
            } else if (result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    onClickIdentityInfor() {
        $("#" + this.identity_information_modal).modal("toggle");
    }

    onSubmitIdentity(data: any = null) {
        data = data.map(el => {
            el.identityCard = el.identityCard;
            el.employeeId = this.data?.employeeProfile?.id;
            el.identityCardValidDate = this.datePipe.transform(new Date(el.identityCardValidDate), "dd/MM/yyyy");
            return el;
        })
        this.employeeService.updateIdentityInfos(data, this.data?.employeeProfile?.id).subscribe(result => {
            if (result && result.success) {
                this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_CCCD_info_successfully"));
                $("#" + this.identity_information_modal).modal("hide");
                this.loadDataEmployee();
            } else if (result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    onClickPersonalTax() {
        $("#" + this.personal_tax_information_modal).modal("show");
    }

    onSubmitPersonalTax(data: any = null) {
        data.employeeId = this.data?.employeeProfile?.id;
        data.startTimeAt = this.datePipe.transform(data.startTimeAt, "dd/MM/yyyy");
        if (data.endTimeAt) {
            data.endTimeAt = this.datePipe.transform(data.endTimeAt, "dd/MM/yyyy");
            ;
        }
        let newObj = Object.assign({}, data);
        delete newObj["familyContacts"];
        const body = {
            familyContacts: data.familyContacts.map(el => {
                let newEl: any = {};
                newEl.dependentPerson = el.dependentPerson;
                newEl.id = el.id;
                return newEl;
            }),
            taxInfo: newObj,
            employeeId: this.data?.employeeProfile?.id
        }
        this.employeeService.updateTaxInfos(body, this.data?.employeeProfile?.id).subscribe(result => {
            if (result && result.success) {
                this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_tax_info_successfully"));
                $("#" + this.personal_tax_information_modal).modal("hide");
                this.loadDataEmployee();
            } else if (result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    onClickSocialInsurance() {
        $("#" + this.social_insurance_information_modal).modal("show");
    }

    onSubmitSocialInsurance(data: any = null) {
        if (data) {
            const body = Object.assign({}, data);
            body.startTimeAt = this.datePipe.transform(body.startTimeAt, "dd/MM/yyyy");
            if (body.endTimeAt) {
                body.endTimeAt = this.datePipe.transform(body.endTimeAt, "dd/MM/yyyy");
            } else {
                body.endTimeAt = null;
            }
            body.socialInsuranceNo = body.socialInsuranceNo;
            body.salaryForSocialInsurance = parseInt(body.salaryForSocialInsurance);
            this.employeeService.updateRelationShip({socialInsurance: body}, this.id).subscribe((result: any) => {
                if (result && result.success) {
                    $("#" + this.social_insurance_information_modal).modal("hide");
                    this.loadDataEmployee();
                    this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_insurance_info_successfully"));
                } else if (result.success == false) {
                    this.toastr.error(result.message, "Lỗi");
                }
            }, (error) => {
                this.toastr.warning(error?.message || error?.title, 'Lỗi');
            });
        }

    }

    onClickPermanentResidence() {
        $("#" + this.permanent_residence_modal).modal("show");
    }

    onSubmitPermanentResidence(data: any = null) {
        $("#" + this.permanent_residence_modal).modal("hide");
    }

    onClickCurrentAddress() {
        $("#" + this.current_address_modal).modal("show");
    }

    onSubmitCurrentAddress(data: any = null) {
        $("#" + this.current_address_modal).modal("hide");
    }

    onClickShowModal(idModal: string) {
        if(this.data?.employeeSalary) {
            this.employeeSalary = this.data.employeeSalary;
        }
        $("#" + idModal).modal("show");
    }

    onClickEditTeamRole() {
        $("#" + this.team_role_modal_edit_id).modal("hide");
    }


    onSubmitDomicile(data: any = null) {
        $("#" + this.social_domicile_information_modal).modal("hide");
    }

    onSubmitFamily(data: any = null) {
        let listId: any[] = [];
        if (this.data?.taxInfoResp?.dependentPersons) {
            listId = this.data?.taxInfoResp?.dependentPersons?.filter(el => el.dependentPerson == true).map(el => el.id);
        }
        const body = data.map(el => {
            el.employeeId = this.data?.employeeProfile?.id;
            el.birthday = this.datePipe.transform(new Date(el.birthday), "dd/MM/yyyy");
            el.dependentPerson = listId.indexOf(el.id) >= 0;
            return el;
        })
        this.employeeService.updateFamilyContactInfos(body, this.data?.employeeProfile?.id).subscribe(result => {
            if (result && result.success) {
                this.toastr.success(this.translate.instant("EmployeeProfile.bank.update_family_info_successfully"));
                $("#" + this.social_family_information_modal).modal("hide");
                this.loadDataEmployee();
            } else if (result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {});
    }

    getListFile(key: string) {
        let list: any = [];
        for (let index = this.data?.catalogStoreds?.length - 1; index >= 0; index--) {
            if (this.data?.catalogStoreds[index]?.catalogName == key) {
                const finder = this.data?.catalogStoreds[index];
                if (finder) {
                    let filePathList = finder.filePath.split('/');
                    finder.fileName = filePathList[filePathList?.length - 1];
                }
                list.push(finder);
            }
        }
        return list;
    }

    getCatalogStoredsByCatalog(catalogName: string = '') {
        let finder = null;
        for (let index = this.data?.catalogStoreds?.length - 1; index >= 0; index--) {
            if (this.data?.catalogStoreds[index]?.catalogName == catalogName) {
                finder = this.data?.catalogStoreds[index];
                break;
            }
        }
        if (finder) {
            return finder.fileId;
        }
        return '';
    }

    getFullName() {
        return this.employeeInfo?.firstName + this.employeeInfo?.lastName;
    }

    getFileName(key: string) {
        let finder = null;
        for (let index = this.data?.catalogStoreds?.length - 1; index >= 0; index--) {
            if (this.data?.catalogStoreds[index]?.catalogName == key) {
                finder = this.data?.catalogStoreds[index];
                break;
            }
        }
        if (finder) {
            let filePathList = finder.filePath.split('/');
            return filePathList[filePathList.length - 1];
        }
        return '';
    }

    getBinaryFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", err => reject(err));

            reader.readAsBinaryString(file);
        });
    }

    onSubmitformalContract(data: any = null) {
        $("#" + this.social_formalContract_information_modal).modal("hide");
    }

    onSubmitStorageProfile(data: any = null) {
        const formData = new FormData();
        formData.append("employeeId", this.employeeInfo?.id);
        formData.append("employeeCode", this.employeeInfo?.employeeCode);
        formData.append("profileFile", data.profileFile);
        formData.append("cvFile", data.cvFile);
        formData.append("cvEnFile", data.cvEnFile);
        formData.append("sylsFile", data.sylsFile);
        formData.append("graduateDegreeFile", data.graduateDegreeFile);
        formData.append("identityFrontSideFile", data.identityFrontSideFile);
        formData.append("identityBackSideFile", data.identityBackSideFile);
        for (let index = 0; index < data.certificateFile.length; index++) {
            const item = data.certificateFile[index];
            formData.append("certificateFile", item);
        }
        formData.append("listIdDeleteFile", data.listIdDeleteFile);
        formData.append("socialInsuranceFile", data.socialInsuranceFile);
        formData.append("avatarFile", data.avatarFile);
        for (let index = 0; index < data.dependentPersonFile.length; index++) {
            const item = data.dependentPersonFile[index];
            formData.append("dependentPersonFile", item);
        }
        this.employeeService.updateCategoryStored(formData).subscribe(result => {
            if (result && result.success) {
                this.toastr.success("Cập nhật dữ liệu hồ sơ thành công", "Thông báo");
                $("#" + this.storage_profile_modal).modal("hide");
                this.loadDataEmployee();
            } else if(result.success == false) {
                this.toastr.error(result.message, "Lỗi");
            }
        }, error => {})
    }

    onSubmitAddressInfo(data: any = null) {
        if (data) {
            this.employeeService.updateRelationShip({employeeContact: data}, this.id).subscribe((result: any) => {
                if (result && result.success) {
                    $("#" + this.address_info_modal).modal("hide");
                    this.loadDataEmployee();
                    this.toastr.success('Cập nhật thông tin địa chỉ thành công!', 'Thông báo');
                } else if(result.success == false){
                    this.toastr.error(result.message, "Lỗi");
                }
            }, (error) => {
            });

        }
    }

    onBlurRejectApprove() {
        this.rejectEmployeeForm.setValue({
            note: this.rejectEmployeeForm.value.note.trim()
        })
    }

    onClickAddNewContract(idModal: string = '') {
        this.dataEmployee = this.data;
        $("#" + idModal).modal("show");
    }

    onAddNewContract(data: any) {
        const formData = new FormData();
        formData.append("contractFile", data.laborContractPath);
        for (let key in data) {
            if (!data[key]) {
                delete data[key];
            }
        }
        if (data.startDate) {
            data.startDate = this.datePipe.transform(data.startDate, "dd/MM/yyyy");
        }
        if (data.endDate) {
            data.endDate = this.datePipe.transform(data.endDate, "dd/MM/yyyy");
        }

        const body = {
            contractFile: data.laborContractPath,
            createLaborContractReq: data
        }
        if (data['laborContractPath']) {
            delete data['laborContractPath'];
        }
        formData.append("createLaborContractReq", new Blob([JSON.stringify(data)], {
            type: 'application/json'
        }));
        this.contractService.create(formData).subscribe(result => {
            if (result && result.body && result.body.success) {
                this.toastr.success("Thêm hợp đồng thành công", "Thông báo");
                $("#" + this.contract_modal).modal("hide");
                setTimeout(() => {
                    this.router.navigate(["/layout/contracts/contractlist"])
                }, 1000);
            } else if(result.body && result.body.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        }, (error) => {
            
        })
    }

    onSavePerformanceInfo(data){
        this.employeeService.saveEmployeeSalary(data).subscribe(result => {
            if(result && result.success){
                $("#" + this.performance_info_modal).modal("hide");
                this.loadDataEmployee()
            }else if(result.success == false){
                this.toastr.error(result.message, "Lỗi");
            }
        })
    }

    getMonthYearFromText(value: string = '') {
        if (value?.length > 3) {
            return value.replace(/(\d{2})\/(\d{2})\/(\d{4})/g, "$2/$3");
        }
        return "";
    }

    canEditEmployeeInfo(inforBlock = '') {
        if(this.employeeInfo && this.companyEmail == this.employeeInfo.companyEmail
            && (this.employeeInfo.status == EMPLOYEE_STATUS_ENUM.CONFIRMED || this.employeeInfo.status == EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE)){
            return true;
        }
        let hasPermissionCoo = this.roles.filter(role => role.code === ROLE_LIST.COO);
        let hasPermissionCB = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        if(hasPermissionCoo.length > 0){
            return true;
        }
        if(hasPermissionCoo.length > 0 && hasPermissionCB.length == 0){
            return false;
        }
        
        if(hasPermissionCB.length > 0){
            if(inforBlock == 'social-insurance' || inforBlock == 'tax-info') {
                if(this.employeeStatus == EMPLOYEE_STATUS_ENUM.WAITING_CB_APPROVE
                    || this.employeeStatus == EMPLOYEE_STATUS_ENUM.UNAPPROVE
                    || this.employeeStatus == EMPLOYEE_STATUS_ENUM.WORKING
                    ){
                        return true;
                    }else{
                        return false;
                    }
            }
            let flag = [EMPLOYEE_STATUS_ENUM.WAITING_CB_APPROVE,
                EMPLOYEE_STATUS_ENUM.CB_APPROVED,
                EMPLOYEE_STATUS_ENUM.UNAPPROVE,
                EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO,
                EMPLOYEE_STATUS_ENUM.WORKING].indexOf(this.employeeStatus) >= 0;
            return flag;
        }
        return hasPermissionCB.length > 0 && [EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE, EMPLOYEE_STATUS_ENUM.WORKING, EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO].indexOf(this.employeeStatus) >= 0;
    }

    showPerformanceEmployee() {
        return [EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO, EMPLOYEE_STATUS_ENUM.WORKING, EMPLOYEE_STATUS_ENUM.RETIRED].indexOf(this.employeeStatus) >= 0;
    }

    canCancelRejectApprove() {
        return true;
    }

    canSendRejectApprove() {
        return true;
    }

    canSendApprove() {
        if(this.isShowRejectApprove){
            return false;
        }
        let listStatus = [EMPLOYEE_STATUS_ENUM.CONFIRMED, EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE];
        if(this.employeeInfo && this.companyEmail == this.employeeInfo.companyEmail && listStatus.indexOf(this.employeeStatus) >= 0){
            return true;
        }
        let hasPermissionCoo = this.roles.filter(role => role.code === ROLE_LIST.COO);
        let hasPermissionCB = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        if(hasPermissionCoo.length > 0 && hasPermissionCB.length == 0){
            return false;
        }
        if(hasPermissionCB.length > 0){
            return this.isUpdatedSpecialInfo && (
                EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE == this.employeeStatus
                || EMPLOYEE_STATUS_ENUM.WORKING == this.employeeStatus
                );
        }
        return false;
    }

    canAddNewContract() {
        let hasPermissionCoo = this.roles.filter(role => role.code === ROLE_LIST.COO);
        let hasPermissionCb = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        if(hasPermissionCoo.length > 0 && hasPermissionCb.length == 0){
            return false;
        }
        if(hasPermissionCb.length > 0){
            let listStatusSend = [
                EMPLOYEE_STATUS_ENUM.CB_APPROVED,
                EMPLOYEE_STATUS_ENUM.CB_UNAPPROVE,
                EMPLOYEE_STATUS_ENUM.WORKING,
            ];
            return listStatusSend.indexOf(this.employeeStatus) >= 0;
        }
        return false;
    }

    canRejectApprove() {
        let hasPermissionCoo = this.roles.filter(role => role.code === ROLE_LIST.COO);
        let hasPermissionCb = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        if(hasPermissionCoo.length > 0 && hasPermissionCb.length == 0){
            return [EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO, EMPLOYEE_STATUS_ENUM.CB_APPROVED].indexOf(this.employeeStatus) >= 0;
        }

        if(hasPermissionCoo.length > 0 && hasPermissionCb.length > 0){
            return [EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO, EMPLOYEE_STATUS_ENUM.CB_APPROVED, EMPLOYEE_STATUS_ENUM.WAITING_CB_APPROVE].indexOf(this.employeeStatus) >= 0;
        }
        
        if(hasPermissionCb.length > 0){
            let listStatus = [EMPLOYEE_STATUS_ENUM.WAITING_CB_APPROVE,
                EMPLOYEE_STATUS_ENUM.UNAPPROVE];
            if(listStatus.indexOf(this.employeeStatus) >= 0){
                return true;
            }else {
                return false;
            }
        }
        return false;
    }

    hasRoleCbAndCoo() {
        let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.COO || role.code === ROLE_LIST.C_B);
        return hasPermission.length > 0;
    }

    canShowWithStatus(infomationBlock: string = ''){
        if(infomationBlock == 'performance-info'){
            let statusRejects = [
                EMPLOYEE_STATUS_ENUM.CB_APPROVED,
                EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO,
                EMPLOYEE_STATUS_ENUM.WORKING,
                EMPLOYEE_STATUS_ENUM.RETIRED,
                EMPLOYEE_STATUS_ENUM.UNAPPROVE
            ];
            return statusRejects.indexOf(this.employeeStatus) >= 0;
        }else if(infomationBlock == 'role-team-info'){
            let statusRejects = [
                EMPLOYEE_STATUS_ENUM.WAITING_APPROVE_CHANGE_INFO,
                EMPLOYEE_STATUS_ENUM.WORKING,
                EMPLOYEE_STATUS_ENUM.RETIRED,
                EMPLOYEE_STATUS_ENUM.UNAPPROVE
            ];
            return statusRejects.indexOf(this.employeeStatus) >= 0;
        }
        return false;
    }

    get isEmployee() {
        let flag = this.roles.find(role => 
            [ROLE_LIST.COO, ROLE_LIST.C_B, ROLE_LIST.TEAM_LEADER]
                .indexOf(role.code) >= 0) == undefined;
        return flag;
    }

    public social_insurance_history_modal = "social_insurance_history_modal"
    public taxinfo_history_modal = "taxinfo_history_modal"
    public performance_history_modal = "performance_history_modal"
    onClickBtnHistory(idModal: string) {
        $("#" + idModal).modal("show");
    }

    getKeyValueChange(changeValue: any, currentValue: any) {
        let obj = {};
        if(changeValue == null){
            return null;
        }
        for(let key in currentValue){
            if(!obj[key]){
                obj[key] = {};
            }
            obj[key].value = currentValue[key];
        }
        for(let key in changeValue){
            if(!obj[key]){
                obj[key] = {
                    value: undefined
                };
            }
            obj[key].value_edit = changeValue[key];
        }
        let result = {};
        for(let key in obj){
            result[key] = obj[key].value != obj[key].value_edit;
        }
        return result;
    }

}
