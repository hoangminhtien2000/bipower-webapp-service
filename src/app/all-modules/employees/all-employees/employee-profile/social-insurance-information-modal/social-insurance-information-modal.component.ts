import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, Constant,
    validateMaxCurrentDate, 
    CustomeDateNotEqualValidators,
    ValidatorCustom} from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { DateTimeUtils } from "src/libs/core/src/utils/date-time.utils";
declare const $: any;
const convertStringToDate = DateTimeUtils.convertStringToDate;

@Component({
    selector: "app-social-insurance-information-modal",
    templateUrl: "./social-insurance-information-modal.component.html",
    styleUrls: ["./social-insurance-information-modal.component.css"],
})
export class SocialInsuranceInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public socialInsuranceForm: FormGroup;
    @Input()
    public idModal: string =  "social-insurance-information-modal";
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
    public imageUrl = environment.imageUrl + "/download-file";
    public currentDate: Date = new Date();
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private enumService: EnumStoredService
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            this.socialInsuranceForm.reset();
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any = null) {
        if(this.socialInsuranceForm){
            this.socialInsuranceForm.setValue({
                id: value?.id ?  value.id : null,
                socialInsuranceNo: value?.socialInsuranceNo ?  value.socialInsuranceNo : "",
                startTimeAt: value?.startTimeAt ?  convertStringToDate(value.startTimeAt) : "",
                endTimeAt: value?.endTimeAt ?  convertStringToDate(value.endTimeAt) : "",
                socialInsuranceStatus: value?.socialInsuranceStatus ?  value.socialInsuranceStatus : "",
                salaryForSocialInsurance: value?.salaryForSocialInsurance ?  value.salaryForSocialInsurance : "",
            });
        }
    }

    ngOnInit() {
        this.socialInsuranceForm = this.formBuilder.group({
            id: [null, []],
            socialInsuranceNo: ["", [Validators.required, Validators.maxLength(10), Validators.pattern('[0-9]+')]],
            startTimeAt: ["", [Validators.required, validDateCustom, validateMaxCurrentDate]],
            endTimeAt: ["", [validDateCustom, validateMaxCurrentDate]],
            socialInsuranceStatus: ["", []],
            salaryForSocialInsurance: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[0-9,]+')]],
        }, { validators: CustomeDateNotEqualValidators.fromToDate('startTimeAt', 'endTimeAt', 'fromToEnd')});
        
        this.loadData()

        const handleChangeStatus  = () => {
            let socialInsuranceStatus = "";
            if(this.socialInsuranceForm.controls['startTimeAt'].value){
                socialInsuranceStatus = "Đang đóng";
            }
            if(this.socialInsuranceForm.controls['endTimeAt'].value){
                socialInsuranceStatus = "Đã dừng";
            }
            this.socialInsuranceForm.controls['socialInsuranceStatus'].patchValue(socialInsuranceStatus);
        }
            
        this.socialInsuranceForm.controls['startTimeAt'].valueChanges.subscribe(handleChangeStatus);
        this.socialInsuranceForm.controls['endTimeAt'].valueChanges.subscribe(handleChangeStatus);
        
    }

    onCancel() {
        $("#" + this.idModal).modal("hide");
    }

    get controls(){
        return this.socialInsuranceForm.controls
    }

    loadData() {
        this.setDefaultValue(this.value);
    }

    onSave() {
        this.socialInsuranceForm.markAllAsTouched();
        if (this.socialInsuranceForm.valid) {
            let salaryForSocialInsurance = "0";
            if(this.socialInsuranceForm.value.salaryForSocialInsurance){
                salaryForSocialInsurance = ('' + this.socialInsuranceForm.value.salaryForSocialInsurance).replace(/,/g, "");
            }
            this.onSubmit.emit({...this.socialInsuranceForm.value, salaryForSocialInsurance});
        }
    }

    onBlur(fieldName: string) {
        if(this.socialInsuranceForm.value && typeof this.socialInsuranceForm.value[fieldName] == "string"){
            this.socialInsuranceForm.setValue({ ...this.socialInsuranceForm.value, [fieldName]: this.socialInsuranceForm.value[fieldName].trim() });
        }
    }

}
