import { DatePipe } from "@angular/common";
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { PrimeNGConfig } from "primeng/api";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, Constant,
    validateMaxCurrentDate, 
    CustomeDateNotEqualValidators,
    ValidatorCustom} from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
declare const $: any;

@Component({
    selector: "app-personal-tax-information-modal",
    templateUrl: "./personal-tax-information-modal.component.html",
    styleUrls: ["./personal-tax-information-modal.component.css"],
})
export class PersonalTaxInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public personalTaxInfomationForm: FormGroup;
    @Input()
    public idModal: string =  "personal-tax-information-modal";
    @Input() value: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    public isDisabled: Boolean = false;
    public textPattern = Constant.NAME_RULE;
    public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
    public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
    public roleCandidates: any = [];
    public stackCandidates: any = [];
    public stackLevelCandidates = [];
    @Input()
    public EMPLOYEE_RELATIONSHIP: any[] = [];
    @Input()
    public GENDER: any[] = [];
    familyContacts: any[] = [];
    public imageUrl = environment.imageUrl + "/download-file";
    public currentDate = new Date();
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private enumService: EnumStoredService,
        private primengConfig: PrimeNGConfig,
        private datePipe: DatePipe, 
    ) {
    }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            this.personalTaxInfomationForm.reset();
            this.familyContacts =  this.value?.familyContacts ? this.value?.familyContacts : [];
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    onCancel() {
        $("#" + this.idModal).modal('hide');
    }
    setDefaultValue(value: any = null) {
        if(this.personalTaxInfomationForm){
            let taxtInfo = null;
            if(value?.newTaxInfo){
                taxtInfo = value?.newTaxInfo;
            }
            this.personalTaxInfomationForm.setValue({
                id: taxtInfo?.id ?  taxtInfo.id : null,
                taxCode: taxtInfo?.taxCode ?  taxtInfo.taxCode : "",
                startTimeAt: taxtInfo?.startTimeAt ?  new Date(taxtInfo.startTimeAt) : "",
                endTimeAt: taxtInfo?.endTimeAt ?  new Date(taxtInfo.endTimeAt) : "",
                taxStatus: taxtInfo?.taxStatus ?  taxtInfo.taxStatus : "",
                salaryToTax: taxtInfo?.salaryToTax ?  taxtInfo.salaryToTax : "",
                familyContacts:  this.familyContacts.filter(el => el.dependentPerson == true),
            });
        }
    }
    onClickMutil() {
    }
    ngOnInit() {
        this.primengConfig.ripple = true;
        this.personalTaxInfomationForm = this.formBuilder.group({
            id: [null, []],
            taxCode: ["", [Validators.required, Validators.maxLength(10), Validators.pattern("[0-9]+")]],
            startTimeAt: ["", [Validators.required, validDateCustom, validateMaxCurrentDate]],
            endTimeAt: ["", [validDateCustom, validateMaxCurrentDate]],
            taxStatus: ["", []],
            salaryToTax: ["", [Validators.required, Validators.pattern("[0-9,]+"), ValidatorCustom.maxLengthCurrency(10)]],
            familyContacts: [[], []],
        }, { validators: CustomeDateNotEqualValidators.fromToDate('startTimeAt', 'endTimeAt', 'fromToDate') });
        
        this.loadData()

        const handleOnTime = () => {
            let textStatus = '';
            if(this.personalTaxInfomationForm.controls['startTimeAt'].value){
                textStatus = 'Đang đóng';
            }
            if(this.personalTaxInfomationForm.controls['endTimeAt'].value){
                textStatus = 'Đã dừng';
            }
            this.personalTaxInfomationForm.controls['taxStatus'].patchValue(textStatus);
        }
        this.personalTaxInfomationForm.controls['startTimeAt'].valueChanges.subscribe(handleOnTime);
        this.personalTaxInfomationForm.controls['endTimeAt'].valueChanges.subscribe(handleOnTime);
        
    }

    get controls(){
        return this.personalTaxInfomationForm.controls
    }

    loadData() {
        this.setDefaultValue(this.value?.taxInfoResp);
    }

    onSave() {
        this.personalTaxInfomationForm.markAllAsTouched();
        if (this.personalTaxInfomationForm.valid) {
            let salaryToTax = '0';
            if(this.personalTaxInfomationForm.value.salaryToTax) {
                salaryToTax = ('' + this.personalTaxInfomationForm.value.salaryToTax).replace(/,/g, "");
            }
            let listId: any[] = this.personalTaxInfomationForm.value.familyContacts.map(el => el.id);
            this.onSubmit.emit({...this.personalTaxInfomationForm.value,
                salaryToTax,
                familyContacts: this.familyContacts.map(el => {
                el.fullName = el.name;
                el.relationshipName = el.relationship;
                el.dependentPerson = listId.indexOf(el.id) >= 0;
                // el.birthday = this.datePipe.transform(new Date(el.birthday), "dd/MM/yyyy");
                // el.birthday = new Date(el.birthday.replace(/(\d{2}\/(\d{2})\/(\d{3}))/, "$3-$2-$1"))
                return el;
              })
            });
        }
    }

    onBlur(fieldName: string) {
        if(this.personalTaxInfomationForm.value && typeof this.personalTaxInfomationForm.value[fieldName] == "string"){
            this.personalTaxInfomationForm.setValue({ ...this.personalTaxInfomationForm.value, [fieldName]: this.personalTaxInfomationForm.value[fieldName].trim() });
        }
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

}
