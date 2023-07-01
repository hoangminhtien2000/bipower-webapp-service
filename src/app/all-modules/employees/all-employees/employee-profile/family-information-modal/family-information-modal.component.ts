import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, 
    validaPhoneNumber, Constant,
    validateMaxCurrentDate } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { DateTimeUtils } from "src/libs/core/src/utils/date-time.utils";
import { GENDER, RELATIONSHIP_LIST } from "src/app/core/common/constant";
declare const $: any;
const convertStringToDate = DateTimeUtils.convertStringToDate;

@Component({
    selector: "app-family-information-modal",
    templateUrl: "./family-information-modal.component.html",
    styleUrls: ["./family-information-modal.component.css"],
})
export class FamilyInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public familyInformationForm: FormGroup;
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
    public imageUrl = environment.imageUrl + "/download-file";
    public provinceList: any = [];
    public familyFormList: FormGroup;
    @Input()
    public GENDER: any[] = [];
    @Input()
    public EMPLOYEE_RELATIONSHIP: any[] = [];
    public currentDate: any = new Date();
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
            this.familyInformationForm.reset();
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes?.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any[]) {
        
        if(value?.length == 0){
            this.addFamily()
        }
        else {
            for(let index = 0; index < value?.length; index++) {
                this.addFamily(value[index])
            }
        }
        
    }

    get listForm() {
        return this.familyFormList.controls['list'] as FormArray;
    }

    addFamily(data:any = null) {
        this.familyInformationForm = this.formBuilder.group({
            id: [data?.id ? data.id: ""],
            name: [data?.name ?data.name: "", [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
            relationship: [data?.relationship ?data.relationship: "", [Validators.required]],
            phone: [data?.phone ?data.phone: "", [Validators.maxLength(10), validaPhoneNumber]],
            gender: [data?.gender ?data.gender: "", [Validators.required]],
            birthday: [data?.birthday ? convertStringToDate(data.birthday): "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
        });
        this.listForm.push(this.familyInformationForm);
        if(this.listForm?.value.length > 0){
            setTimeout(() => {
              $(`#familyForm_institution_${this.listForm.value.length - 1}`).focus();
            }, 500);
          }
    }

    removeFamily(index: number) {
        this.listForm.removeAt(index);
    }

    ngOnInit() {
        this.familyFormList = this.formBuilder.group({
            list: this.formBuilder.array([])
        })

        this.addFamily();
        this.provinceList = [];
        
    }

    get controls(){
        return this.familyInformationForm.controls
    }

    loadData() {
        this.familyFormList = this.formBuilder.group({
            list: this.formBuilder.array([])
        })
       this.setDefaultValue(this.value);
    }

    onSave() {
        this.listForm.markAllAsTouched();
        if (this.listForm.valid) {
            this.onSubmit.emit(this.listForm.value.map(item => ({ ...item,phone: item.phone ? item.phone: null })));
        }
    }

    onBlur(fieldName: string, index: number) {
        if(this.familyFormList.value && typeof this.familyFormList.value){
            const list = this.familyFormList.value.list;
            if(list[index][fieldName]){
                list[index][fieldName] = list[index][fieldName].trim();
            }
            this.familyFormList.setValue({
                list: list
            })
        }
    }

    onCancel() {
        $("#" + this.idModal).modal('hide');
    }

}
