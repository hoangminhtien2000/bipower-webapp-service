import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, Constant, validateMaxCurrentDate } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
declare const $: any;

@Component({
    selector: "app-education-information-modal",
    templateUrl: "./education-information-modal.component.html",
    styleUrls: ["./education-information-modal.component.css"],
})
export class EducationInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public educationInformationForm: FormGroup;
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
    public educationFormList: FormGroup;
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
            this.educationInformationForm.reset();
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any[]) {
        
        if(value.length == 0){
            this.addEducation()
        }
        else {
            for(let index = 0; index < value.length; index++) {
                this.addEducation(value[index])
            }
        }
        
    }

    get listForm() {
        return this.educationFormList.controls['list'] as FormArray;
    }

    addEducation(data:any = null) {
        this.educationInformationForm = this.formBuilder.group({
            firstName: [data?.firstName ?data.firstName: "", [Validators.required, Validators.maxLength(200), Validators.pattern(this.textPattern)]],
            relative: [data?.relative ?data.relative: "", [Validators.required]],
            gender: [data?.gender ?data.gender: "", [Validators.required]],
            birthday: [data?.birthday ?data.birthday: "", [Validators.required, validDateCustom, validateMaxCurrentDate]],
        });
        this.listForm.push(this.educationInformationForm);
        if(this.listForm?.value.length > 0){
            setTimeout(() => {
              $(`#educationForm_institution_${this.listForm.value.length - 1}`).focus();
            }, 500);
          }
    }
    
    removeEducation(index: number) {
        this.listForm.removeAt(index);
    }

    ngOnInit() {
        this.educationFormList = this.formBuilder.group({
            list: this.formBuilder.array([])
        })

        this.addEducation();
        
    }

    get controls(){
        return this.educationInformationForm.controls
    }

    loadData() {
        this.educationFormList = this.formBuilder.group({
            list: this.formBuilder.array([])
        })
       this.setDefaultValue(this.value);
    }

    onSave() {
        this.educationInformationForm.markAllAsTouched();
        if (this.educationInformationForm.valid) {
            this.toastr.success('Them moi thanh cong','thongbao');
            $('#' + this.idModal).modal('hide');
            this.onSubmit.emit(this.educationInformationForm.value);
        }
    }

    onBlur(fieldName: string) {
        if(this.educationInformationForm.value && typeof this.educationInformationForm.value[fieldName] == "string"){
            this.educationInformationForm.setValue({ ...this.educationInformationForm.value, [fieldName]: this.educationInformationForm.value[fieldName].trim() });
        }
    }

}
