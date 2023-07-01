import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EmployeeService } from "src/app/core/services/employee.service";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { validDateCustom, validateMaxCurrentDate, Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { TranslateService } from "@ngx-translate/core";
declare const $: any;
@Component({
    selector: "app-employee-reject-modal",
    templateUrl: "./employee-reject-modal.component.html",
    styleUrls: ["./employee-reject-modal.component.css"],
})
export class EmployeeRejectModalComponent implements OnInit, OnChanges, AfterViewInit {
    public addEmployeeRejectForm: FormGroup;
    @Input()
    public idModal: string =  "add_reject";
    @Input() value: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    @ViewChild("inputFristName") inputFristName: ElementRef;
    public isDisabled: Boolean = false;
    public textPattern = Constant.NAME_RULE;
    public AVATAR_DEFAULT: any = "assets/img/profiles/avatar-2.jpg";
    public avatarBase64: any = "assets/img/profiles/avatar-2.jpg";
    public roleCandidates: any = [];
    public stackCandidates: any = [];
    public stackLevelCandidates = [];
    public list_QC = ["QC", "HR"];
    public employee_modal_reject = 'add_reject';
    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private enumService: EnumStoredService,
        private translate: TranslateService
    ) { }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
        });
         modal?.on('hidden.bs.modal', () => {
            this.onClose.emit(false);
        })
        modal?.on('show.bs.modal', () => {
            this.addEmployeeRejectForm.reset();
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
        this.addEmployeeRejectForm.setValue({
            reason: value?.reason?value?.reason:"",
        })

        if(value.id){
            if(this.list_QC.indexOf(this.addEmployeeRejectForm.value.roleType.trim()) >= 0){
                this.isDisabled = false;
              }else{
                this.isDisabled = true;
                this.addEmployeeRejectForm.get('stack').setValidators([Validators.required]);
                this.addEmployeeRejectForm.get('stack')?.updateValueAndValidity();
                this.addEmployeeRejectForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
                this.addEmployeeRejectForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
              }
        }

        setTimeout(() => {
            this.inputFristName.nativeElement.focus();
        }, 500)
    }

    ngOnInit() {
        $("#" + this.idModal).modal({
            backdrop: 'static'
        });
        $("#" + this.idModal).on('hidden.bs.modal', () => {
            this.onClose.emit(false);
        })
        this.loadEmployeeProfile()
        
    }

    loadEmployeeProfile() {
        const value = this.value;
        this.addEmployeeRejectForm = this.formBuilder.group({
            reason: ["", [Validators.required,]],
        });
        
    }

   

    onClickButtonSend() {
        this.addEmployeeRejectForm.markAllAsTouched();
        if (this.addEmployeeRejectForm.valid) {
            this.toastr.success('Xac nhan thanh cong','thongbao');
            $('#' + this.employee_modal_reject).modal('hide');
            this.onSubmit.emit(this.addEmployeeRejectForm.value);
        }
    }

    onClickButtonCancel() {
        $("#"+this.employee_modal_reject).modal("hide");
    }
    
    onBlur(fieldName: string) {
        if(this.addEmployeeRejectForm.value && typeof this.addEmployeeRejectForm.value[fieldName] == "string"){
            this.addEmployeeRejectForm.setValue({ ...this.addEmployeeRejectForm.value, [fieldName]: this.addEmployeeRejectForm.value[fieldName].trim() });
        }
    }

    onChangeRole(){
        if(this.list_QC.indexOf(this.addEmployeeRejectForm.value.roleType.trim()) >= 0){
          this.addEmployeeRejectForm.get('stack').clearValidators();
          this.addEmployeeRejectForm.get('stack').updateValueAndValidity();
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom').clearValidators();
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom')?.reset("");
          this.isDisabled = false;
        }else{
          this.addEmployeeRejectForm.get('stack').setValidators([Validators.required]);
          this.addEmployeeRejectForm.get('stack').updateValueAndValidity();
          this.addEmployeeRejectForm.get('stack').reset("");
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom').setValidators([Validators.required, validDateCustom, validateMaxCurrentDate]);
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom')?.updateValueAndValidity();
          this.addEmployeeRejectForm.get('workingTimeWithStackFrom').reset("");
          this.isDisabled = true;
        }
    }

}
