import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, Constant,
    validateMaxCurrentDate } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { DateTimeUtils } from "src/libs/core/src/utils/date-time.utils";
import { IDENTITY_CARD_TYPE } from "src/app/core/common/constant";
declare const $: any;
const convertStringToDate = DateTimeUtils.convertStringToDate;

@Component({
    selector: "app-identity-information-modal",
    templateUrl: "./identity-information-modal.component.html",
    styleUrls: ["./identity-information-modal.component.css"],
})
export class IdentityInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public idEntityInformationForm: FormGroup;
    public objectListForm: FormGroup;
    @Input()
    public idModal: string =  "identity-information-modal";
    @Input() value: any = [];
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
    public EMPLOYEE_IDENTITY_TYPE: any = [];
    public imageUrl = environment.imageUrl + "/download-file";
    public currentDate = new Date();
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
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any[]) {
        if(value?.length === 0){
            this.addIdentity();
        }else{
            for(let index = 0; index < value?.length; index++){
                this.addIdentity(value[index]);
            }
        }
    }


    get listForm() {
        return this.objectListForm.controls['list'] as FormArray;
    }

    getValidatorIdentityCard(value) {
        if(value?.identityCardType == "HC"){
            return [Validators.required]
        }else{
            return [Validators.required,Validators.maxLength(12), Validators.minLength(9), Validators.pattern('[0-9]+')];
        }
    }

    addIdentity(data: any = null) {
        const idEntityInformationForm = this.formBuilder.group({
            id: [data?.id ? data.id : null, []],
            identityCard: [data?.identityCard ? data.identityCard : "", [...this.getValidatorIdentityCard(data)]],
            identityCardValidDate: [data?.identityCardValidDate ? convertStringToDate(data.identityCardValidDate) : "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
            identityCardPlace: [data?.identityCardPlace ? data.identityCardPlace : "", [Validators.required, Validators.maxLength(100)]],
            identityCardType: [data?.identityCardType ? data.identityCardType : "", [Validators.required]],
        });
        this.listForm.push(idEntityInformationForm);
        if(this.listForm?.value?.length > 0){
            setTimeout(() =>  {
                // $('#identityNumber_' + (this.listForm?.value?.length - 1)).focus()
            }, 500);
        }
    }
    removeIdentity(index: number) {
        this.listForm.removeAt(index);
    }

    ngOnInit() {
        this.objectListForm = this.formBuilder.group({
            list: this.formBuilder.array([])
        })
    }

    loadData() {
        this.objectListForm = this.formBuilder.group({
            list: this.formBuilder.array([])
        })
       this.setDefaultValue(this.value);
    }

    onSave() {
        this.objectListForm.markAllAsTouched();
        if (this.objectListForm.valid) {
            this.onSubmit.emit(this.objectListForm.value.list);
        }
    }

    onBlur(fieldName: string, index: number) {
        const list: any[] = this.objectListForm?.controls["list"].value;
        list[index][fieldName] = list[index][fieldName].trim();
        this.objectListForm.setValue({
          list: list
        })
    }

    onClickCancel() {
        $("#" + this.idModal).modal('hide');
    }

    onChangeIdentityCardType(item: any) {
        item as FormGroup;
        if(item.get('identityCardType').value == "HC"){
            item.get('identityCard').setValidators([Validators.required]);
            item.get('identityCard').updateValueAndValidity();
            item.get('identityCard').reset("");
        }else{
            item.get('identityCard').setValidators([Validators.required,Validators.maxLength(12), Validators.minLength(9), Validators.pattern('[0-9]+')]);
            item.get('identityCard').updateValueAndValidity();
            item.get('identityCard').reset("");
        }
    }

}
