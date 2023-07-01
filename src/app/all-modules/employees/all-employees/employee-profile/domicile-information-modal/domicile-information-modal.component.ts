import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/core/services/employee.service";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
declare const $: any;
@Component({
    selector: "app-domicile-information-modal",
    templateUrl: "./domicile-information-modal.component.html",
    styleUrls: ["./domicile-information-modal.component.css"],
})
export class DomicileInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public domicileInformationForm: FormGroup;
    @Input()
    public idModal: string =  "identity-information-modal";
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
    public provinceList: any = [];
    public districtList: any = [];
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
            this.domicileInformationForm.reset();
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any) {
        this.domicileInformationForm.setValue({
            district: value.district ? value.district : "",
            province: value.province ? value.province : "",
        });
    }

    ngOnInit() {
        this.domicileInformationForm = this.formBuilder.group({
            district: ["", [Validators.required]],
            province: ["", [Validators.required]],
            
        });
        
        this.loadData()

        this.domicileInformationForm.controls['province'].valueChanges.subscribe(() => {
            if(this.domicileInformationForm.controls['province'].value){
                this.loadProvince(this.domicileInformationForm.controls['province'].value);
                this.domicileInformationForm.controls['district'].setValue('');
            }else{
                this.districtList = [];
                this.domicileInformationForm.controls['district'].setValue('');
            }
        })
        
    }

    loadProvince(id: string) {
        
    }

    get controls(){
        return this.domicileInformationForm.controls
    }

    loadData() {
       this.setDefaultValue(this.value);
    }

    onSave() {
        this.domicileInformationForm.markAllAsTouched();
        if (this.domicileInformationForm.valid) {
            this.toastr.success('Them moi thanh cong','thongbao');
            $('#' + this.idModal).modal('hide');
            this.onSubmit.emit(this.domicileInformationForm.value);
        }
    }

    onBlur(fieldName: string) {
        if(this.domicileInformationForm.value && typeof this.domicileInformationForm.value[fieldName] == "string"){
            this.domicileInformationForm.setValue({ ...this.domicileInformationForm.value, [fieldName]: this.domicileInformationForm.value[fieldName].trim() });
        }
    }

}
