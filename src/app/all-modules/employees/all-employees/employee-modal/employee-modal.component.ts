import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DateTimeUtils } from "src/libs/core/src/utils/date-time.utils";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/core/services/employee.service";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, validFileMaxSize,
    validRequiredType, validaPhoneNumber,
    validateMaxCurrentDate, CustomeDateNotEqualValidators, Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { GENDER, POSITION_EMPLOYEE, STACK_TECH } from "src/app/core/common/constant";
import { FileService } from "src/app/core/services/file.service";
import * as moment from "moment";
declare const $: any;
const convertStringToDate = DateTimeUtils.convertStringToDate;
@Component({
    selector: "app-employee-modal",
    templateUrl: "./employee-modal.component.html",
    styleUrls: ["./employee-modal.component.css"],
})
export class EmployeeModalComponent implements OnInit, OnChanges, AfterViewInit {
    public addEmployeeForm: FormGroup;
    public addPositionForm: FormGroup;
    @Input()
    public idModal: string =  "add_employee";
    @Input() value: any = '';
    @Input() data: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @ViewChild("inputFristName") inputFristName: ElementRef;

    public isDisabled: Boolean = false;
    public textPattern = Constant.NAME_RULE;
    public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
    public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
    public roleCandidates: any = [];
    @Input()
    public TECHNOLOGY: any[] = [];
    @Input()
    public EMPLOYEE_POSITION: any[] = [];
    public stackLevelCandidates = [];
    public currentDate = new Date();
    public list_QC = ["Developer", "DEVELOPER"];
    @Input()
    public GENDER: any[] = [];
    public imageUrl = environment.imageUrl;
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private enumService: EnumStoredService,
        private fileService: FileService,
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
         modal?.on('hidden.bs.modal', () => {
            this.onClose.emit(false);
        })
        modal?.on('show.bs.modal', () => {
            this.avatarBase64 = '';
            this.addEmployeeForm.reset();
            this.setDefaultValue(this.value);
            this.onClose.emit(false);
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadEmployeeProfile();
        }
    }

    setDefaultValue(value: any) {
        this.addEmployeeForm.setValue({
            id: value?.id ? value.id : null,
            avatarFile: "",
            workStatus: value?.workStatus ? value?.workStatus: "",
            employeeCode: value?.employeeCode ? value?.employeeCode:"" ,
            avatarPath: value?.avatarPath ? value?.avatarPath:"" ,
            firstName: value?.firstName?value?.firstName:"",
            lastName: value?.lastName?value?.lastName:"",
            individualEmail: value?.individualEmail ? value?.individualEmail:"",
            companyEmail: value?.companyEmail ? value?.companyEmail:"",
            startDate: value?.onboardDate ? convertStringToDate(value?.onboardDate):"",
            endDate: value?.endDate ? value?.endDate:"",
            phone: value?.phone?value?.phone: "",
            birthday: value?.birthday ? convertStringToDate(value?.birthday):"",
            gender: value?.gender ? value?.gender:"",
            position: value?.position ? this.EMPLOYEE_POSITION.filter(el => el.code == value?.position): [],
            stackTech: value?.stackTech ? value?.stackTech:"",
            maritalStatus: value?.maritalStatus ? value?.maritalStatus:"",
            englishLevel: value?.englishLevel ? value?.englishLevel:"",
            onboardDate: value?.onboardDate ? convertStringToDate(value?.onboardDate): "",
            lastWorkingDate: value?.lastWorkingDate ? convertStringToDate(value?.lastWorkingDate): "",
            workingTimeFrom: value?.workingTimeFrom ? convertStringToDate(value?.workingTimeFrom): "",
            workingTimeWithStackFrom: value?.workingTimeWithStackFrom ? convertStringToDate(value?.workingTimeWithStackFrom): "",
            contractStatus: value?.contractStatus ? value?.contractStatus:"",
            numberOfMonthWorkInCompany: value?.numberOfMonthWorkInCompany ? value?.numberOfMonthWorkInCompany:"",
            yearsOfWorkExperience: value?.yearsOfWorkExperience ? value?.yearsOfWorkExperience:"",
            yearsOfStackExperience: value?.yearsOfStackExperience ? value?.yearsOfStackExperience:"",

        })

        if(value?.id){
            if(this.list_QC.find(el => this.addEmployeeForm.value.position.map(el => el.code).indexOf(el) >= 0)){
                this.isDisabled = true;
                this.addEmployeeForm.get('stackTech').setValidators([Validators.required]);
                this.addEmployeeForm.get('stackTech')?.updateValueAndValidity();
                this.addEmployeeForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
                this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
            }else{
                this.isDisabled = false;
                this.addEmployeeForm.get('stackTech').setValidators([]);
                this.addEmployeeForm.get('stackTech')?.updateValueAndValidity();
                this.addEmployeeForm.get('workingTimeWithStackFrom').setValidators([validDateCustom, validateMaxCurrentDate]);
                this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
            }
        }else{
            this.isDisabled = true;
            this.addEmployeeForm.get('stackTech').setValidators([Validators.required]);
            this.addEmployeeForm.get('stackTech')?.updateValueAndValidity();
            this.addEmployeeForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
            this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
        }
        if(this.getCatalogStoredsByCatalog('avatarFile')){
            this.getFileImage(this.getCatalogStoredsByCatalog('avatarFile'));
        }else{
            this.avatarBase64 = this.AVATAR_DEFAULT;
        }
        

        if(this.list_QC.find(el => this.addEmployeeForm.value.position.indexOf(el) >= 0)){
            this.addEmployeeForm.setValidators([CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('onboardDate', 'lastWorkingDate', 'onboardDateLastWorkingDate')])
        }else{
            this.addEmployeeForm.setValidators([CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('workingTimeFrom', 'workingTimeWithStackFrom', 'workTimeStartToEnd'), CustomeDateNotEqualValidators.fromToDate('onboardDate', 'lastWorkingDate', 'onboardDateLastWorkingDate')])
        }

        setTimeout(() => {
            this.inputFristName.nativeElement.focus();
        }, 500)
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

    downloadImage(filePath: string, cb: any){
        this.fileService.getFile(Number(filePath)).subscribe(res => {
            cb(res.data);
        });
    }

    getFileImage(path: string){
        if(path){
            this.downloadImage(path, (binary) => {
                let fileName = binary.display_name;
                let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
                const result = this.fileService.convertBase64ToBlob(binary.content, "image/" + suff);
                let reader = new FileReader();
                reader.readAsDataURL(result); 
                reader.onloadend = () => {
                    let base64data = reader.result;                
                    this.avatarBase64 = base64data;
                }
            });
        }
    }

    loadEmployeeProfile() {
        const value = this.value;
        this.addPositionForm = this.formBuilder.group({
            "positionName": ["", [Validators.required]]
        })
        this.addEmployeeForm = this.formBuilder.group({
            id: ["", []],
            workStatus: ["", []],
            employeeCode: ["", [Validators.required]],
            avatarFile: ["", [validRequiredType, validFileMaxSize]],
            avatarPath: ["", []],
            firstName: ["", [Validators.required, Validators.maxLength(50), Validators.pattern(this.textPattern)]],
            lastName: ["", [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
            individualEmail: ["", [Validators.required, Validators.pattern(Constant.EMAIL_PATTERN), Validators.maxLength(100)]],
            companyEmail: ["", [Validators.pattern(Constant.EMAIL_PATTERN), Validators.maxLength(100)]],
            phone: ["", [Validators.required, Validators.maxLength(10), Validators.minLength(10), validaPhoneNumber]],
            birthday: ["", [Validators.required, validDateCustom, validateMaxCurrentDate]],
            startDate: ["", [validDateCustom, validateMaxCurrentDate]],
            endDate: ["", [validDateCustom, validateMaxCurrentDate]],
            gender: ["", [Validators.required]],
            position: [[], [Validators.required]],
            stackTech: ["", [Validators.required]],
            maritalStatus: ["", []],
            englishLevel: ["", []],
            onboardDate: ["", []],
            lastWorkingDate: ["", [validDateCustom, validateMaxCurrentDate]],
            workingTimeFrom: ["", [Validators.required, validDateCustom, validateMaxCurrentDate]],
            workingTimeWithStackFrom: ["", [validDateCustom, validateMaxCurrentDate]],
            contractStatus: ["", []],
            numberOfMonthWorkInCompany: ["", []],
            yearsOfWorkExperience: ["", []],
            yearsOfStackExperience: ["", []],
        }, { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('workingTimeFrom', 'workingTimeWithStackFrom', 'workTimeStartToEnd'), CustomeDateNotEqualValidators.fromToDate('onboardDate', 'lastWorkingDate', 'onboardDateLastWorkingDate')]});
        
        this.setDefaultValue(value);

        this.addEmployeeForm.controls['endDate'].valueChanges.subscribe(success => {
            if(this.addEmployeeForm.controls['endDate'].value){
                this.addEmployeeForm.controls['workStatus'].patchValue(false);
            }else{
                this.addEmployeeForm.controls['workStatus'].patchValue(true);
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
                // this.avatarBase64 = imgBase64Path;
                };
            };
            reader.readAsDataURL(file);
            }
        }
    }

    onClickButtonSave() {
        this.addEmployeeForm.markAllAsTouched();
        let invalid = [];
        const controls = this.addEmployeeForm.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        if (this.addEmployeeForm.valid) {
            const valueResult = Object.assign({}, { ...this.addEmployeeForm.value, position: this.addEmployeeForm.value.position.map(el => el.code) });
            // delete valueResult['companyEmail'];
            // delete valueResult['startDate'];
            // delete valueResult['endDate'];
            // delete valueResult['workingTimeFrom'];
            // delete valueResult['workingTimeWithStackFrom'];
            this.onSubmit.emit(valueResult);
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
            this.addEmployeeForm.get('stackTech').setValidators([Validators.required]);
            this.addEmployeeForm.get('stackTech').updateValueAndValidity();
            this.addEmployeeForm.get('stackTech').reset("");
            this.addEmployeeForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
            this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
            this.addEmployeeForm.get('workingTimeWithStackFrom').reset("");
            this.isDisabled = true;
        }else{
            this.addEmployeeForm.get('stackTech').clearValidators();
            this.addEmployeeForm.get('stackTech').updateValueAndValidity();
            this.addEmployeeForm.get('stackTech').reset();
            this.addEmployeeForm.get('workingTimeWithStackFrom').clearValidators();
            this.addEmployeeForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
            this.addEmployeeForm.get('workingTimeWithStackFrom')?.reset("");
            this.isDisabled = false;
        }
        if(this.addEmployeeForm.value.position.find(el => el.code == 'OTHER') != undefined) {
            this.addEmployeeForm.controls['position'].setValue(this.addEmployeeForm.value.position.filter(el => el.code != 'OTHER'));
            this.addPositionForm.reset();
            $("#" + this.idModal + 'add_position_modal').modal("show");
        }
    }

    addNewPositionToList() {
        this.addPositionForm.markAllAsTouched();
        if(this.addPositionForm.valid){
            const objectAdd = {
                code: this.addPositionForm.value.positionName,
                name: this.addPositionForm.value.positionName
            };
            this.EMPLOYEE_POSITION = [...this.EMPLOYEE_POSITION, objectAdd];
            this.addEmployeeForm.controls['position'].setValue([...this.addEmployeeForm.controls['position'].value, objectAdd])
            $("#" + this.idModal + 'add_position_modal').modal("hide");
        }
    }

    onCancelAddPosition() {
        $("#" + this.idModal + 'add_position_modal').modal("hide");
    }

    onBlurAddPosition(name: string) {
        if(this.addPositionForm.value[name]){
            this.addPositionForm.setValue({ [name]: this.addPositionForm.value[name].trim() })
        }
    }


    getCatalogStoredsByCatalog(catalogName: string = '') {
        const finder = this.data?.catalogStoreds?.find(el => el.catalogName == catalogName);
        if(finder){
            return finder.fileId;
        }
        return '';
    }

    onCancel() {
        $("#" + this.idModal).modal("hide");
    }

    onClickMutil() {

    }

}
