import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/core/services/employee.service";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, validateMaxCurrentDate, Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { CustomYearWorkingPipe } from "src/assets/pipes/custom-year-working.pipe";
import { environment } from "src/environments/environment";
import {GENDER, POSITION_EMPLOYEE, ROLE_LIST, STACK_TECH} from "../../../../core/common/constant";
import { FileService } from "src/app/core/services/file.service";
import {UserStorage} from "../../../../core/storage/user.storage";
declare const $: any;
@Component({
    selector: "app-employee-modal-view",
    templateUrl: "./employee-modal-view.component.html",
    styleUrls: ["./employee-modal-view.component.css"],
})
export class EmployeeModalViewComponent implements OnInit, OnChanges, AfterViewInit {
    public addEmployeeForm: FormGroup;
    public rejectForm: FormGroup;
    @Input()
    public idModal: string =  "add_employee_view";
    @Input() value: any = '';
    @Input() data: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @ViewChild("inputFristName") inputFristName: ElementRef;
    public isDisabled: Boolean = false;
    public textPattern = Constant.NAME_RULE;
    public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
    public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
    @Input()
    public GENDER: any = [];
    public roleCandidates: any = [];
    @Input()
    public TECHNOLOGY: any = [];
    public stackLevelCandidates = [];
    @Input()
    public EMPLOYEE_POSITION: any = [];
    public currentDate = new Date();
    public list_QC = ["Developer", "DEVELOPER"];
    public imageUrl = environment.imageUrl;
    public employeeStatus: string = 'PENDING';
    roles = this.userStorage.getUserRoles();
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private enumService: EnumStoredService,
        private fileService: FileService,
        private userStorage: UserStorage
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            // backdrop: 'static',
            keyboard: false
        });
        modal?.on('hidden.bs.modal', () => {
            this.onClose.emit(false);
        })
        modal?.on('show.bs.modal', () => {
            this.addEmployeeForm.reset();
            this.rejectForm.reset();
            this.rejectForm.setValue({ note: '' });
            this.setDefaultValue(this.value?.employeeProfile);
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadEmployeeProfile();
        }
    }

    convertStringToDate(str: string = ''){
        if(str){
            return moment(new Date(str.replace(/(\d{2})\/(\d{2})\/(\d{4})/g, "$3-$2-$1"))).toDate();
        }
        return new Date();
    }

    setDefaultValue(value: any) {
        this.addEmployeeForm.setValue({
            id: value?.id ? value.id : null,
            avatarFile: "",
            workingStatus: value?.workingStatus ? value?.workingStatus: "",
            employeeCode: value?.employeeCode ? value?.employeeCode:"" ,
            avatarPath: value?.avatarPath ? value?.avatarPath:"" ,
            firstName: value?.firstName?value?.firstName:"",
            lastName: value?.lastName?value?.lastName:"",
            individualEmail: value?.individualEmail ? value?.individualEmail:"",
            companyEmail: value?.companyEmail ? value?.companyEmail:"",
            startDate: value?.onboardDate ? this.convertStringToDate(value.onboardDate):"",
            endDate: value?.endDate ? this.convertStringToDate(value?.endDate):"",
            phone: value?.phone?value?.phone: "",
            birthday: value?.birthday ? this.convertStringToDate(value?.birthday):"",
            gender: value?.gender ? value?.gender:"",
            position: value?.position ? value?.position:[],
            stackTech: value?.stackTech ? value?.stackTech:"",
            maritalStatus: value?.maritalStatus ? value?.maritalStatus:"",
            englishLevel: value?.englishLevel ? value?.englishLevel:"",
            onboardDate: value?.onboardDate ? this.convertStringToDate(value?.onboardDate): "",
            lastWorkingDate: value?.lastWorkingDate ? this.convertStringToDate(value?.lastWorkingDate): "",
            workingTimeFrom: value?.workingTimeFrom ? this.convertStringToDate(value?.workingTimeFrom): "",
            workingTimeWithStackFrom: value?.workingTimeWithStackFrom ? this.convertStringToDate(value?.workingTimeWithStackFrom): "",
            contractStatus: value?.contractStatus ? value?.contractStatus:"",
            numberOfMonthWorkInCompany: value?.numberOfMonthWorkInCompany ? value?.numberOfMonthWorkInCompany:"",
            yearsOfWorkExperience: value?.yearsOfWorkExperience ? value?.yearsOfWorkExperience:"",
            yearsOfStackExperience: value?.yearsOfStackExperience ? value?.yearsOfStackExperience:"",
        })

        if(value?.id){
            if(this.list_QC.find(el => this.addEmployeeForm.value.position.map(el => el).indexOf(el) >= 0)){
                this.isDisabled = true;
            }else{
                this.isDisabled = false;
            }
        }else{
            this.isDisabled = true;
        }

        if(this.getCatalogStoredsByCatalog('avatarFile')){
            this.getFileImage(this.getCatalogStoredsByCatalog('avatarFile'));
        }else{
            this.avatarBase64 = this.AVATAR_DEFAULT;
        }

        this.employeeStatus = this.value?.employeeStatus;   

        setTimeout(() => {
            this.inputFristName.nativeElement.focus();
        }, 500)
    }

    getCatalogStoredsByCatalog(catalogName: string = '') {
        let finder = null;
        for(let index = this.value?.catalogStoreds?.length - 1; index >= 0; index--){
            if(this.value?.catalogStoreds[index]?.catalogName == catalogName){
                finder = this.value?.catalogStoreds[index];
                break;
            }
        }
        if(finder){
            return finder.id;
        }
        return '';
    }
    
    getCatalogStoredsByCatalogName(catalogName: string = '') {
        let finder = null;
        for(let index = this.value?.catalogStoreds?.length - 1; index >= 0; index--){
            if(this.value?.catalogStoreds[index]?.catalogName == catalogName){
                finder = this.value?.catalogStoreds[index];
                break;
            }
        }
        if(finder){
            let filePathList = finder.filePath.split('/');
            return filePathList[filePathList.length - 1];
        }
        return '';
    }

    get isHide() {
        return this.employeeStatus == 'PENDING';
    }

    ngOnInit() {
        $("#" + this.idModal).modal({
            backdrop: 'static',
            keyboard: false
        });
        $("#" + this.idModal).on('hidden.bs.modal', () => {
            this.onClose.emit(false);
        })
        this.loadEmployeeProfile();
        
    }

    loadEmployeeProfile() {
        this.rejectForm = this.formBuilder.group({
            note: ['', [Validators.required, Validators.maxLength(500)]]
        })
        const value = this.value?.employeeProfile;
        this.addEmployeeForm = this.formBuilder.group({
            id: ["", []],
            workingStatus: ["", []],
            employeeCode: ["", []],
            avatarFile: ["", []],
            avatarPath: ["", []],
            firstName: ["", []],
            lastName: ["", []],
            individualEmail: ["", []],
            companyEmail: ["", []],
            phone: ["", []],
            birthday: ["", []],
            startDate: ["", []],
            endDate: ["", []],
            gender: ["", []],
            position: ["", []],
            stackTech: ["", []],
            maritalStatus: ["", []],
            englishLevel: ["", []],
            onboardDate: ["", []],
            lastWorkingDate: ["", []],
            workingTimeFrom: ["", []],
            workingTimeWithStackFrom: ["", []],
            contractStatus: ["", []],
            numberOfMonthWorkInCompany: ["", []],
            yearsOfWorkExperience: ["", []],
            yearsOfStackExperience: ["", []],
        });
        
        this.setDefaultValue(value);

        this.addEmployeeForm.controls['endDate'].valueChanges.subscribe(success => {
            if(this.addEmployeeForm.controls['endDate'].value){
                this.addEmployeeForm.controls['workingStatus'].patchValue(false);
            }else{
                this.addEmployeeForm.controls['workingStatus'].patchValue(true);
            }
        });
        const caculate = (fieldValue: string, fieldChange: string) => {
            return success => {
                let time = '';
                if(this.addEmployeeForm.controls[fieldValue].value){
                    const startDate = new Date(this.addEmployeeForm.controls[fieldValue].value);
                    const currentDate = new Date();
                    const numberMonth:number = (currentDate.getTime() - startDate.getTime()) / (1000*60*60*24 * 30);
                    if( numberMonth > 0 ){
                        this.addEmployeeForm.controls[fieldChange].patchValue(`${(Math.floor(numberMonth/12) + "").padStart(2, "0")} năm ${(Math.floor(numberMonth%12) + "").padStart(2, "0")} tháng`);
                    }
                }else{
                    this.addEmployeeForm.controls[fieldChange].patchValue('');
                }
            }
        }

        this.addEmployeeForm.controls['workingTimeFrom'].valueChanges.subscribe(caculate('workingTimeFrom', 'yearsOfWorkExperience'));
        this.addEmployeeForm.controls['workingTimeWithStackFrom'].valueChanges.subscribe(caculate('workingTimeWithStackFrom', 'yearsOfStackExperience'));
    }

    async fileChangeAvatar(files: any) {
        if (files && files[0]) {
            const file = files[0];
            const formData: FormData = new FormData();
            formData.append("thumbnail", files[0]);
            if (file) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
                const image = new Image();
                image.src = e.target.result;
                image.onload = rs => {
                const imgBase64Path = e.target.result;
                this.avatarBase64 = imgBase64Path;
                };
            };
            reader.readAsDataURL(file);
            }
        }
    }

    onClickConfirm() {
        this.onSubmit.emit({
            isApproval: true,
            note: '',
            id: this.value?.employeeProfile?.id
        })
    }
    cancelReject() {
        $('#reject_employee_modal').modal('hide');
    }
    onClickConfirmReject() {
        this.rejectForm.markAllAsTouched();
        if(this.rejectForm.valid){
            this.onSubmit.emit({
                isApproval: false,
                note: this.rejectForm.value?.note,
                id: this.value?.employeeProfile?.id
            });
            $('#reject_employee_modal').modal('hide');
        }
    }

    onBlur(fieldName: string) {
        if(fieldName == 'firstName' || fieldName == 'lastName'){
            let value = '';
            if(this.addEmployeeForm.value && typeof this.addEmployeeForm.value[fieldName] == "string"){
                let valueSplit = this.addEmployeeForm.value[fieldName].split(' ');
                value = valueSplit.reduce((preV: string, curV: string) => {
                    let str = curV;
                    if(str.length > 0){
                        str = str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase();
                    }
                    preV += ' ' + str;
                    return preV;
                }, '');

                this.addEmployeeForm.setValue({ ...this.addEmployeeForm.value, [fieldName]: value.trim() });
            }
        }else
        if(this.addEmployeeForm.value && typeof this.addEmployeeForm.value[fieldName] == "string"){
            this.addEmployeeForm.setValue({ ...this.addEmployeeForm.value, [fieldName]: this.addEmployeeForm.value[fieldName].trim() });
        }
    }

    resetValueEmailCompany() {
        // let firstName: string = this.addEmployeeForm.controls['firstName'].value;
        // let lastName: string = this.addEmployeeForm.controls['lastName'].value;
        // if(firstName?.length >= 0 && lastName?.length >= 0 && this.addEmployeeForm.controls['companyEmail'].value == ''){
        //     firstName = this.removeVietnameseTones(firstName.toLowerCase());
        //     lastName = this.removeVietnameseTones(lastName.toLowerCase());
        //     lastName = lastName.replace(/\s/g, "");
        //     let splitFirstName : string[] = firstName.split(' ');
        //     let lastNameRefact: string = splitFirstName.reduce((preV, curV) => {
        //         preV += curV.trim().substring(0,1);
        //         return preV;
        //     }, '');
        //     this.addEmployeeForm.controls['companyEmail'].setValue(lastName + lastNameRefact + '@biplus.com.vn');
        // }
    }
    onChangeLastName() {
        this.resetValueEmailCompany();
    }

    onChangeFirstName() {
        this.resetValueEmailCompany();
    }
    
    removeVietnameseTones(str: string) {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }

    onChangeRole(){
        if(this.list_QC.find(el => this.addEmployeeForm.value.position.map(el => el.code).indexOf(el) >= 0)){
          this.addEmployeeForm.get('stackTech').clearValidators();
          this.addEmployeeForm.get('stackTech').updateValueAndValidity();
          this.addEmployeeForm.get('workingTimeWithStackFrom').clearValidators();
          this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
          this.addEmployeeForm.get('workingTimeWithStackFrom')?.reset("");
          this.isDisabled = false;
        }else{
          this.addEmployeeForm.get('stackTech').setValidators([Validators.required]);
          this.addEmployeeForm.get('stackTech').updateValueAndValidity();
          this.addEmployeeForm.get('stackTech').reset("");
          this.addEmployeeForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
          this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
          this.addEmployeeForm.get('workingTimeWithStackFrom').reset("");
          this.isDisabled = true;
        }
    }

    onReject() {
        $("#reject_employee_modal").modal("show");
    }

    yearWorking(field: string = '') {
        return new CustomYearWorkingPipe().transform(this.value?.employeeProfile?.[field]);  
    }

    onBlurRejectConfirm() {
        this.rejectForm.setValue({
            note: this.rejectForm.value?.note.trim()
        })
    }

    canReject() {
        if(this.value && this.value?.employeeStatus == "REJECTED"){
            return false;
        }
        let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        return hasPermission.length > 0;
    }

    canConfirm() {
        if(this.value && this.value?.employeeStatus == "REJECTED"){
            return false;
        }
        let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        return hasPermission.length > 0;
    }

    downloadImage(filePath: string, cb: any){
        this.employeeService.downloadfile(filePath).subscribe(res => {
            cb(res.data);
        });
    }

    getFileImage(path: string){
        if(path){
            let fileNameSplit = path.split("/");
            let fileName = fileNameSplit[fileNameSplit.length - 1];
            let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
            this.downloadImage(path, (binary) => {
                const result = this.fileService.convertBase64ToBlob(binary, "image/" + suff);
                let reader = new FileReader();
                reader.readAsDataURL(result); 
                reader.onloadend = () => {
                    let base64data = reader.result;                
                    this.avatarBase64 = base64data;
                }
            });
        }
    }
}
