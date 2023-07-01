import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { DateTimeUtils } from "src/libs/core/src/utils/date-time.utils";
import * as moment from "moment";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import {
    validDateCustom,
    validateMaxCurrentDate, RequireTypeFile, CustomeDateNotEqualValidators, ValidatorCustom
} from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { CustomFormatDate } from 'src/assets/pipes/custom-format-date.pipe';
import {EmployeeService, ContractService} from "../../../core";
import {ROLE_LIST, URL_IMAGE_PREV} from "../../../core/common/constant";
import {UserStorage} from "../../../core/storage/user.storage";
declare const $: any;
const convertStringToDate = DateTimeUtils.convertStringToDate;
interface Field{
    fieldName: string,
    value?: any,
    isDisabled?: boolean,
    validators?: ValidatorFn[]
}
@Component({
    selector: "app-contract-modal",
    templateUrl: "./contract-modal.component.html",
    styleUrls: ["./contract-modal.component.css"],
})
export class ContractModalComponent implements OnInit, OnChanges, AfterViewInit {
    public collaboratorsContractInforForm: FormGroup;
    public formalContractInforForm: FormGroup;
    public probationContractInforForm: FormGroup;
    public rejectForm: FormGroup;
    public collaboratorsContractType = "HDDV";
    public formalContractType = "HDLD";
    public probationContractType = "HDTV";
    public isShow = false;
    public isFirst = false;
    public flag:boolean = false;
    public maxLength: number = 35;
    public employees = [];
    public isNew = false;
    @Input()
    public idModal: string = "add_contract";
    @Input() value: any = '';
    @Input() employeeId: any = '';
    @Input() employeeCode: any = '';
    @Input() data: any = '';
    @Output() onSubmit = new EventEmitter<any>();
    @Output() onApprove = new EventEmitter<any>();
    @Output() onClose = new EventEmitter<any>();
    public isDisabled: Boolean = false;
    public textPattern = "[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$"
    
    public currentDate = new Date();
    public imageUrl = URL_IMAGE_PREV.url;
    public selectOption: any = this.collaboratorsContractType;
    public employeeSelected: any = '';
    roles = this.userStorage.getUserRoles();
    listContract

    constructor(
        private toastr: ToastrService,
        private formBuilder: FormBuilder,
        private employeeService: EmployeeService,
        private contractService: ContractService,
        private customFormatDate: CustomFormatDate,
        private userStorage: UserStorage
    ) {
        this.generateForm();
    }
    ngAfterViewInit(): void {
        const modal: any = $("#" + this.idModal);
        modal?.modal({
            backdrop: 'static',
            keyboard: false
        });
        modal?.on('show.bs.modal', () => {
            $('#' + this.idModal + ' input[type=file]').each((index, element) => {
                $(element).val('');
            })
            this.collaboratorsContractInforForm.reset();
            this.formalContractInforForm.reset();
            this.probationContractInforForm.reset();
            this.loadEmployee();
            this.listContract=ContractService.listCollaborators

        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value || changes.value == null) {
            this.loadData();
        }
    }

    isRequire(fieldName: string){
        if(this.selectOption == this.collaboratorsContractType){
            return this.collaboratorsContractInforForm.controls[fieldName].hasValidator(Validators.required);
        }else if(this.selectOption == this.formalContractType){
            return this.formalContractInforForm.controls[fieldName].hasValidator(Validators.required);
        }else if(this.selectOption == this.probationContractType){
            return this.probationContractInforForm.controls[fieldName].hasValidator(Validators.required);
        }
        return false;
    }

    async updateControl(form: FormGroup, listField: Field[] | string[] | any [], isDisabled = true) {
        if(form){
            for(let index = 0; index < listField.length; index++){
                let item = listField[index]
                if(typeof item == 'string'){
                    form.controls[item].enable();
                    if(isDisabled == true){
                        form.controls[item].disable();
                    }else if(isDisabled == false){
                        form.controls[item].enable();
                    }
                }else{
                    item = listField[index] as Field;
                    form.controls[item.fieldName].enable();
                    if(item.value){
                        form.controls[item.fieldName].setValue(item.value);
                    }
                    if(!item.validators){
                        item.validators = [];
                    }
                    if(item.validators && item.validators.length >= 0){
                        let currentValue = form.controls[item.fieldName].value;
                        if(item.value){
                            currentValue = item.value;
                        }
                        form.controls[item.fieldName].setValidators(item.validators);
                        form.controls[item.fieldName].updateValueAndValidity();
                        form.controls[item.fieldName].reset(currentValue ? currentValue : "");
                    }
                    if(item.isDisabled){
                        form.controls[item.fieldName].disable();
                    }
                }
            }
            form.updateValueAndValidity();
            form.reset(form.getRawValue());
        }
    }

    async setDefaultValue(value: any) {
        this.isFirst = false;
        this.isNew = false;
        if(this.data && this.data.isFirstContract){
            this.isFirst = true;
            this.isNew = true;
        }
        let employeeSelect = value?.employeeId ? { id: value?.employeeId } : "";
        if (this.collaboratorsContractInforForm) {
            this.collaboratorsContractInforForm.enable()
            this.collaboratorsContractInforForm.setValue({
                id: value?.id ? value?.id : "",
                contractCode: value?.contractCode ? value?.contractCode : "",
                laborContractStatus: value?.laborContractStatus ? value?.laborContractStatus : "",
                startDate: value?.startDate ? convertStringToDate(value.startDate) : "",
                endDate: value?.endDate ? convertStringToDate(value.endDate) : "",
                negotiableSalary: value?.negotiableSalary ? value?.negotiableSalary : "",
                resultEvaluation: value?.resultEvaluation ? value?.resultEvaluation : "",
                contractSalary: value?.contractSalary ? value?.contractSalary : "",
                contractTerminationDate: value?.contractTerminationDate ? convertStringToDate(value.contractTerminationDate) : "",
                contractTerm: value?.contractTerm ? value?.contractTerm : "",
                employee: employeeSelect,
                laborContractPath:  "",
            });
        }
        if (this.formalContractInforForm) {
            this.formalContractInforForm.enable();
            this.formalContractInforForm.setValue({
                id: value?.id ? value?.id : "",
                contractCode: value?.contractCode ? value?.contractCode : "",
                laborContractStatus: value?.laborContractStatus ? value?.laborContractStatus : "",
                startDate: value?.startDate ? convertStringToDate(value.startDate) : "",
                endDate: value?.endDate ? convertStringToDate(value.endDate) : "",
                contractTerm: value?.contractTerm ? value?.contractTerm : "",
                insuranceSalary: value?.insuranceSalary ? value?.insuranceSalary : "",
                netSalary: value?.netSalary ? value?.netSalary : "",
                grossSalary: value?.grossSalary ? value?.grossSalary : "",
                resultEvaluation: value?.resultEvaluation ? value?.resultEvaluation : "",
                contractTerminationDate: value?.contractTerminationDate ? convertStringToDate(value.contractTerminationDate) : "",
                employee: employeeSelect,
                laborContractPath: "",

            });
        }
        if (this.probationContractInforForm) {
            this.probationContractInforForm.enable();
            this.probationContractInforForm.setValue({
                id: value?.id ? value?.id : "",
                contractCode: value?.contractCode ? value?.contractCode : "",
                laborContractStatus: value?.laborContractStatus ? value?.laborContractStatus : "",
                startDate: value?.startDate ? convertStringToDate(value.startDate) : "",
                endDate: value?.endDate ? convertStringToDate(value.endDate) : "",
                contractTerminationDate: value?.contractTerminationDate ? convertStringToDate(value.contractTerminationDate) : "",
                resultEvaluation: value?.resultEvaluation ? value?.resultEvaluation : "",
                officialSalary: value?.officialSalary ? value?.officialSalary : "",
                employee: employeeSelect,
                probationalSalary: value?.probationalSalary ? value?.probationalSalary : "",
                contractTerm: value?.contractTerm ? value?.contractTerm : "",
                laborContractPath: "",
            });
        }
        if(value?.employeeCode){
            this.isFirst = value.isFirstContract;
            if(this.isFirst){
                this.updateControl(this.formalContractInforForm, [
                    {
                        fieldName: "laborContractPath",
                        isDisabled: false
                    },
                ]);
            }
        }
        if(value?.contractType){
            this.selectOption = value?.contractType;
            this.isShow = true;

            this.collaboratorsContractInforForm.disable();
            this.probationContractInforForm.disable();
            this.formalContractInforForm.disable();

            this.collaboratorsContractInforForm.controls['resultEvaluation'].enable();
            this.probationContractInforForm.controls['resultEvaluation'].enable();
            this.formalContractInforForm.controls['resultEvaluation'].enable();
    
            this.collaboratorsContractInforForm.controls['contractTerminationDate'].enable();
            this.probationContractInforForm.controls['contractTerminationDate'].enable();
            this.formalContractInforForm.controls['contractTerminationDate'].enable();

            this.collaboratorsContractInforForm.controls['laborContractPath'].enable();
            this.probationContractInforForm.controls['laborContractPath'].enable();
            this.formalContractInforForm.controls['laborContractPath'].enable();

            this.updateControl(this.formalContractInforForm, [
                {
                    fieldName: "grossSalary",
                },
            ])
        }
        if(!value){
            this.isShow = false;
            this.isNew = true;
            if(this.collaboratorsContractInforForm){
                this.collaboratorsContractInforForm.enable();
                this.updateControl(this.collaboratorsContractInforForm, [
                    { fieldName: 'employee', isDisabled: false, validators: [Validators.required] }, 
                    { fieldName: 'resultEvaluation', isDisabled: false, validators: [] }, 
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [] }, 
                    { fieldName: 'contractTerminationDate', isDisabled: false, validators: [] }, 
                    { fieldName: 'endDate', isDisabled: true, validators: [] }, 
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)] }, 
                    'startDate', 'contractTerm', 'negotiableSalary', 'contractSalary'], false);
            }
            if(this.formalContractInforForm){
                this.formalContractInforForm.enable();
                this.updateControl(this.formalContractInforForm, [
                    { fieldName: 'employee', isDisabled: false, validators: [] },
                    { fieldName: 'resultEvaluation', isDisabled: false, validators: [] }, 
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [] },
                    { fieldName: 'contractTerminationDate', isDisabled: false, validators: [] }, 
                    { fieldName: 'endDate', isDisabled: true, validators: [] },
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)] }, 
                    'startDate', 'contractTerm', 'insuranceSalary', 'netSalary', 'grossSalary'], false);
            }
            if(this.probationContractInforForm){
                this.probationContractInforForm.enable();
                this.updateControl(this.probationContractInforForm, [
                    { fieldName: 'employee', isDisabled: false, validators: [] },
                    { fieldName: 'resultEvaluation', isDisabled: false, validators: [] }, 
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [] },
                    { fieldName: 'contractTerminationDate', isDisabled: false, validators: [] }, 
                    { fieldName: 'endDate', isDisabled: true, validators: [] },
                    { fieldName: 'laborContractPath', isDisabled: false, validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)] }, 
                    'startDate', 'contractTerm', 'probationalSalary', 'officialSalary'], false);
            }
        }else if(value?.laborContractStatus == "EXPIRED"){
            this.collaboratorsContractInforForm.disable();
            this.probationContractInforForm.disable();
            this.formalContractInforForm.disable();

            this.updateControl(this.collaboratorsContractInforForm, [{fieldName: 'laborContractPath', validators: [Validators.required], isDisabled: true}]);
            this.updateControl(this.probationContractInforForm, [{fieldName: 'laborContractPath', validators: [Validators.required], isDisabled: true}]);
            this.updateControl(this.formalContractInforForm, [{fieldName: 'laborContractPath', validators: [Validators.required], isDisabled: true}]);
        }else if(value?.laborContractStatus == "UNAPPROVE"){
            let listControls = [
                { fieldName: "employee", validators: [], isDisabled: true }, 
                { fieldName: "contractTerminationDate", validators: [validDateCustom] }, 
                { fieldName: "resultEvaluation", validators: [Validators.maxLength(500)]}
            ]
            this.collaboratorsContractInforForm.enable();
            this.probationContractInforForm.enable();
            this.formalContractInforForm.enable();
            this.updateControl(this.collaboratorsContractInforForm, [...listControls, 
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractCode", validators: [], isDisabled: false},
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "endDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
            ]);
            this.updateControl(this.probationContractInforForm, [...listControls,
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractCode", validators: [], isDisabled: false},
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "endDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "officialSalary", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "probationalSalary", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
            ]);
            this.updateControl(this.formalContractInforForm, [...listControls,
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractCode", validators: [], isDisabled: false},
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "endDate", validators: [Validators.required], isDisabled: true},

                { fieldName: "insuranceSalary", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "netSalary", validators: [Validators.required], isDisabled: this.isFirst},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
            ]);
        }else if(value?.laborContractStatus == "PENDING"){
            let listControls = [
                { fieldName: "employee", validators: [], isDisabled: true }, 
                { fieldName: "contractTerminationDate", validators: [validDateCustom] }, 
                { fieldName: "resultEvaluation", validators: [Validators.maxLength(500)]}
            ]
            this.collaboratorsContractInforForm.enable();
            this.probationContractInforForm.enable();
            this.formalContractInforForm.enable();
            this.updateControl(this.collaboratorsContractInforForm, [...listControls, 
                { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                { fieldName: "contractCode", validators: [], isDisabled: false},
                { fieldName: "startDate", validators: [Validators.required]},
                { fieldName: "contractTerm", validators: [Validators.required]},
                { fieldName: "endDate", validators: []},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
            ]);
            this.updateControl(this.probationContractInforForm, [...listControls,
                { fieldName: "startDate", validators: [Validators.required]},
                { fieldName: "contractCode", validators: []},
                { fieldName: "startDate", validators: [Validators.required]},
                { fieldName: "contractTerm", validators: [Validators.required]},
                { fieldName: "officialSalary", validators: [Validators.required]},
                { fieldName: "probationalSalary", validators: [Validators.required]},
                { fieldName: "endDate", validators: []},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)]},
            ]);
            this.updateControl(this.formalContractInforForm, [...listControls,
                { fieldName: "startDate", validators: [Validators.required]},
                { fieldName: "contractCode", validators: []},
                { fieldName: "startDate", validators: [Validators.required]},
                { fieldName: "contractTerm", validators: [Validators.required]},
                { fieldName: "endDate", validators: []},

                { fieldName: "insuranceSalary", validators: [Validators.required]},
                { fieldName: "netSalary", validators: [Validators.required]},
                { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)]},
            ]);
        }else if(this.value?.laborContractStatus == "WAITING_APPROVE"){
            this.collaboratorsContractInforForm.disable();
            this.probationContractInforForm.disable();
            this.formalContractInforForm.disable();
        }else if(this.value?.laborContractStatus == "EFFECT"){
                let requireField = [Validators.required];
                let listControls = [{
                    fieldName: "contractTerminationDate",
                    validators: [...requireField, validDateCustom],
                    isDisabled: false
                }, 
                {
                    fieldName: "resultEvaluation",
                    validators: [...requireField, Validators.maxLength(500)],
                    isDisabled: false
                }, 
                {
                    fieldName: "startDate",
                    validators: [Validators.required],
                    isDisabled: true
                }, 
                {
                    fieldName: "endDate",
                    validators: [Validators.required],
                    isDisabled: true
                }, 
                {
                    fieldName: "contractCode",
                    validators: [],
                    isDisabled: false
                }, 
                {
                    fieldName: "laborContractPath",
                    validators: [],
                    isDisabled: true
                }];
                this.updateControl(this.collaboratorsContractInforForm, listControls);
                this.updateControl(this.probationContractInforForm, listControls);
                this.updateControl(this.formalContractInforForm, [...listControls,
                    { fieldName: "grossSalary", validators: [], isDisabled: true },
                ]);
        }else{
            if(this.collaboratorsContractInforForm || this.probationContractInforForm || this.formalContractInforForm){
                let listControls = [
                    { fieldName: "contractTerminationDate", validators: [validDateCustom] }, 
                    { fieldName: "resultEvaluation", validators: [Validators.maxLength(500)]}
                ]
                this.collaboratorsContractInforForm.enable();
                this.probationContractInforForm.enable();
                this.formalContractInforForm.enable();
                this.updateControl(this.collaboratorsContractInforForm, [...listControls, 
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractCode", validators: [], isDisabled: false},
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "endDate", validators: [], isDisabled: true},
                    { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
                ]);
                this.updateControl(this.probationContractInforForm, [...listControls,
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractCode", validators: [], isDisabled: false},
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "endDate", validators: [], isDisabled: true},
                    { fieldName: "officialSalary", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "probationalSalary", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
                ]);
                this.updateControl(this.formalContractInforForm, [...listControls,
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractCode", validators: [], isDisabled: false},
                    { fieldName: "startDate", validators: [Validators.required], isDisabled: true},
                    { fieldName: "contractTerm", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "endDate", validators: [], isDisabled: true},

                    { fieldName: "insuranceSalary", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "netSalary", validators: [Validators.required], isDisabled: this.isFirst},
                    { fieldName: "laborContractPath", validators: [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)], isDisabled: false},
                ]);
            }
        }
        this.updateControl(this.collaboratorsContractInforForm, [
            { fieldName: "contractCode", validators: [], isDisabled: false},
        ]);
        this.updateControl(this.probationContractInforForm, [
            { fieldName: "contractCode", validators: [], isDisabled: false},
        ]);
        this.updateControl(this.formalContractInforForm, [
            { fieldName: "contractCode", validators: [], isDisabled: false},
        ]);
    }

    enableForm() {
        if(this.collaboratorsContractInforForm){
            this.collaboratorsContractInforForm.enable();
        }
        if(this.probationContractInforForm){
            this.probationContractInforForm.enable();
        }
        if(this.formalContractInforForm){
            this.formalContractInforForm.enable();
        }
    }

    onChangeSelect() {
        if(this.collaboratorsContractType == this.selectOption){
            this.listContract=ContractService.listCollaborators
            this.collaboratorsContractInforForm.enable();
            this.collaboratorsContractInforForm.reset();
        }else if(this.formalContractType == this.selectOption){
            this.listContract=ContractService.listFormal
            this.formalContractInforForm.enable();
            this.formalContractInforForm.reset();
        }else if(this.probationContractType == this.selectOption){
            this.listContract=ContractService.listProbation
            this.probationContractInforForm.enable();
            this.probationContractInforForm.reset();
        }
        if(this.collaboratorsContractType == this.value.contractType){
            this.collaboratorsContractInforForm.setValue({
                id: this.value?.id ? this.value?.id : "",
                contractCode: this.value?.contractCode ? this.value?.contractCode : "",
                laborContractStatus: this.value?.laborContractStatus ? this.value?.laborContractStatus : "",
                startDate: this.value?.startDate ? convertStringToDate(this.value.startDate) : "",
                endDate: this.value?.endDate ? convertStringToDate(this.value.endDate) : "",
                negotiableSalary: this.value?.negotiableSalary ? this.value?.negotiableSalary : "",
                resultEvaluation: this.value?.resultEvaluation ? this.value?.resultEvaluation : "",
                contractSalary: this.value?.contractSalary ? this.value?.contractSalary : "",
                contractTerminationDate: this.value?.contractTerminationDate ? convertStringToDate(this.value.contractTerminationDate) : "",
                contractTerm: this.value?.contractTerm ? this.value?.contractTerm : "",
                employee: this.value?.employeeId ? this.value?.employeeId : "",
                laborContractPath:  "",
            });
        }
        if(this.formalContractType == this.value.contractType){
            this.formalContractInforForm.setValue({
                id: this.value?.id ? this.value?.id : "",
                contractCode: this.value?.contractCode ? this.value?.contractCode : "",
                laborContractStatus: this.value?.laborContractStatus ? this.value?.laborContractStatus : "",
                startDate: this.value?.startDate ? convertStringToDate(this.value.startDate) : "",
                endDate: this.value?.endDate ? convertStringToDate(this.value.endDate) : "",
                contractTerm: this.value?.contractTerm ? this.value?.contractTerm : "",
                insuranceSalary: this.value?.insuranceSalary ? this.value?.insuranceSalary : "",
                netSalary: this.value?.netSalary ? this.value?.netSalary : "",
                grossSalary: this.value?.grossSalary ? this.value?.grossSalary : "",
                resultEvaluation: this.value?.resultEvaluation ? this.value?.resultEvaluation : "",
                contractTerminationDate: this.value?.contractTerminationDate ? convertStringToDate(this.value.contractTerminationDate) : "",
                employee: this.value?.employeeId ? this.value?.employeeId : "",
                laborContractPath: "",

            });
        }
        if(this.probationContractType == this.value.contractType){
            this.probationContractInforForm.setValue({
                id: this.value?.id ? this.value?.id : "",
                contractCode: this.value?.contractCode ? this.value?.contractCode : "",
                laborContractStatus: this.value?.laborContractStatus ? this.value?.laborContractStatus : "",
                startDate: this.value?.startDate ? convertStringToDate(this.value.startDate) : "",
                endDate: this.value?.endDate ? convertStringToDate(this.value.endDate) : "",
                contractTerminationDate: this.value?.contractTerminationDate ? convertStringToDate(this.value.contractTerminationDate) : "",
                resultEvaluation: this.value?.resultEvaluation ? this.value?.resultEvaluation : "",
                officialSalary: this.value?.officialSalary ? this.value?.officialSalary : "",
                probationalSalary: this.value?.probationalSalary ? this.value?.probationalSalary : "",
                contractTerm: this.value?.contractTerm ? this.value?.contractTerm : "",
                employee: this.value?.employeeId ? this.value?.employeeId : "",
                laborContractPath: "",
            });
        }
    }

    async onChangeEmployee(value: any){
        if(this.isShow == false || this.employeeId){
            let employeeFinder = null;
            if(this.employeeId){
                employeeFinder = this.employees.find(el => el.employeeId == this.employeeId);
            }else{
                employeeFinder = value;
            }
            const condidateInfo_result: any = await this.contractService.getFirstContractData(employeeFinder.candidateId).toPromise();
            const condidateInfo = condidateInfo_result.data;
            if(this.employeeId){
                this.collaboratorsContractInforForm.controls['employee'].setValue(employeeFinder);
                this.formalContractInforForm.controls['employee'].setValue(employeeFinder);
                this.probationContractInforForm.controls['employee'].setValue(employeeFinder);
            }
            if(employeeFinder){
                this.employeeSelected = employeeFinder;
                this.isFirst = false;
                if(this.data){
                    this.isFirst = this.data.isFirstContract;
                }else{
                    let result_employee:any = await this.employeeService.findById(this.employeeSelected.employeeId).toPromise();
                    this.isFirst = result_employee?.data?.isFirstContract;
                }
                if(this.isFirst){
                    this.selectOption = condidateInfo.contractType;
                }
                let hasFirst = this.isFirst ? true : false;
                if(this.selectOption == this.collaboratorsContractType){
                    let listControl = [
                        { 
                            fieldName: "startDate", 
                            value: convertStringToDate(employeeFinder.startDate),
                            validators: [Validators.required],
                            isDisabled: true
                        },
                        { 
                            fieldName: "contractTerm", 
                            value: hasFirst ? condidateInfo.contractTerm : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "negotiableSalary", 
                            value: hasFirst ? condidateInfo.negotiableSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "contractSalary", 
                            value: hasFirst ? condidateInfo.contractSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "employee", 
                            value: employeeFinder,
                            validators: [Validators.required],
                            isDisabled: false
                        },
                    ];
                    this.updateControl(this.collaboratorsContractInforForm, listControl);
                }else if(this.selectOption == this.formalContractType){
                    let listControl = [
                        { 
                            fieldName: "startDate", 
                            value: convertStringToDate(employeeFinder.startDate),
                            validators: [Validators.required],
                            isDisabled: true
                        },
                        { 
                            fieldName: "contractTerm", 
                            value: hasFirst ? condidateInfo.contractTerm : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "insuranceSalary", 
                            value: hasFirst ? condidateInfo.insuranceSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "netSalary", 
                            value: hasFirst ? condidateInfo.netSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "grossSalary",
                            isDisabled: false,
                        },
                        { 
                            fieldName: "employee", 
                            value: employeeFinder,
                            validators: [Validators.required],
                            isDisabled: false
                        },
                    ];
                    this.updateControl(this.formalContractInforForm, listControl);
                }else if(this.selectOption == this.probationContractType){
                    let listControl = [
                        { 
                            fieldName: "startDate", 
                            value: convertStringToDate(employeeFinder.startDate),
                            validators: [Validators.required],
                            isDisabled: true
                        },
                        { 
                            fieldName: "contractTerm", 
                            value: hasFirst ? condidateInfo.contractTerm : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "probationalSalary", 
                            value: hasFirst ? condidateInfo.probationalSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "officialSalary", 
                            value: hasFirst ? condidateInfo.officialSalary : "",
                            validators: [Validators.required],
                            isDisabled: hasFirst
                        },
                        { 
                            fieldName: "employee", 
                            value: employeeFinder,
                            validators: [Validators.required],
                            isDisabled: false
                        },
                    ];
                    this.updateControl(this.probationContractInforForm, listControl);
                }
            }
            if(this.data){
                let startDate = this.data.employeeProfile?.onboardDate ? this.data.employeeProfile.onboardDate : "";
                let socialInsurance = this.data.employeeProfile?.socialInsurance?.salaryForSocialInsurance ? this.data.employeeProfile.socialInsurance.salaryForSocialInsurance : "";
                this.updateControl(this.collaboratorsContractInforForm, [
                    { 
                        fieldName: 'startDate',
                        value: convertStringToDate(startDate),
                        isDisabled: true,
                    },
                ]);
                this.updateControl(this.formalContractInforForm, [
                    { 
                        fieldName: 'startDate',
                        value: convertStringToDate(startDate),
                        isDisabled: true,
                    },
                    { 
                        fieldName: 'insuranceSalary',
                        value: this.isFirst ? socialInsurance : "",
                        isDisabled: this.isFirst
                    }
                ]);
                this.updateControl(this.probationContractInforForm, [
                    { 
                        fieldName: 'startDate',
                        value: convertStringToDate(startDate),
                        isDisabled: true,
                    },
                ]);
            }
        }
    }

    ngOnInit() {
        this.rejectForm = this.formBuilder.group({
            note: ["", [Validators.required, Validators.maxLength(500)]]
        });
        // { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('workingTimeFrom', 'workingTimeWithStackFrom', 'workTimeStartToEnd')]};
        this.loadData();
        this.loadEmployee();
    }

    generateForm () {
        this.collaboratorsContractInforForm = this.formBuilder.group({
            id: ["", []],
            contractCode: ["", [Validators.maxLength(100)]],
            laborContractStatus: ["", []],
            startDate: ["", [validDateCustom, validateMaxCurrentDate]],
            endDate: ["", []],
            negotiableSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            resultEvaluation: ["", [...this.getValidateRequire(this.value, 'resultEvaluation'), Validators.maxLength(50)]],
            contractSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            contractTerminationDate: ["", [...this.getValidateRequire(this.value, 'contractTerminationDate'), validDateCustom]],
            employee: ["",[Validators.required]],
            laborContractPath: ["", [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)]],
            contractTerm: ["", [Validators.required]],
        }, { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'contractTerminationDate', 'fromToDate', 0)]});
        // { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('workingTimeFrom', 'workingTimeWithStackFrom', 'workTimeStartToEnd')]};
        this.formalContractInforForm = this.formBuilder.group({
            id: ["", []],
            contractCode: ["", [Validators.maxLength(100)]],
            laborContractStatus: ["", []],
            startDate: ["", [validDateCustom, validateMaxCurrentDate]],
            endDate: ["", []],
            contractTerm: ["", [Validators.required]],
            insuranceSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            netSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            grossSalary: ["", [ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            resultEvaluation: ["", [...this.getValidateRequire(this.value, 'resultEvaluation'), Validators.maxLength(50)]],
            contractTerminationDate: ["", [...this.getValidateRequire(this.value, 'contractTerminationDate'), validDateCustom]],
            employee: ["", [Validators.required]],
            laborContractPath: ["", [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)]],

        }, { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'contractTerminationDate', 'fromToDate', 0)]});
        // { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'endDate', 'startToEnd'), CustomeDateNotEqualValidators.fromToDate('workingTimeFrom', 'workingTimeWithStackFrom', 'workTimeStartToEnd')]};
        this.probationContractInforForm = this.formBuilder.group({
            id: ["", []],
            contractCode: ["", [Validators.maxLength(100)]],
            laborContractStatus: ["", []],
            startDate: ["", [validDateCustom, validateMaxCurrentDate]],
            endDate: ["", []],
            contractTerminationDate: ["", [...this.getValidateRequire(this.value, 'contractTerminationDate'), validDateCustom]],
            resultEvaluation: ["", [...this.getValidateRequire(this.value, 'resultEvaluation'), Validators.maxLength(50)]],
            officialSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            employee: ["", [Validators.required]],
            probationalSalary: ["", [Validators.required, ValidatorCustom.maxLengthCurrency(10), Validators.pattern('[a-zA-z0-9,]+')]],
            contractTerm: ["", [Validators.required]],
            laborContractPath: ["", [RequireTypeFile.typeFile(["pdf"]), RequireTypeFile.maxSizeFile(5)]],
        }, { validators: [CustomeDateNotEqualValidators.fromToDate('startDate', 'contractTerminationDate', 'fromToDate', 0)]});

        this.collaboratorsContractInforForm.controls["contractTerm"].valueChanges.subscribe(value => {
            if(value){
                let startDate = this.collaboratorsContractInforForm.controls['startDate'].value;
                let month = this.collaboratorsContractInforForm.controls['contractTerm'].value;
                let day = this.formalContractInforForm.controls['contractTerm'].value;
                this.collaboratorsContractInforForm.controls['endDate'].patchValue(moment(startDate).add(month/1, "month").add(day/-7,"day").toDate());
            }else if(value != '') this.collaboratorsContractInforForm.controls["contractTerm"].setValue('');
        });
        this.formalContractInforForm.controls["contractTerm"].valueChanges.subscribe(value => {
            if(value){
                let startDate = this.formalContractInforForm.controls['startDate'].value;
                let month = this.formalContractInforForm.controls['contractTerm'].value;
                let day = this.formalContractInforForm.controls['contractTerm'].value;
                this.formalContractInforForm.controls['endDate'].patchValue(moment(startDate).add(month/1, "month").add(day/-7,"day").toDate());
            }else if(value != '') this.formalContractInforForm.controls["contractTerm"].setValue('');
        });
        this.probationContractInforForm.controls["contractTerm"].valueChanges.subscribe(value => {
            if(value){
                let startDate = this.probationContractInforForm.controls['startDate'].value;
                let month = this.probationContractInforForm.controls['contractTerm'].value;
                let day = this.probationContractInforForm.controls['contractTerm'].value;
                this.probationContractInforForm.controls['endDate'].patchValue(moment(startDate).add(month/1, "month").add(day/-7,"day").toDate());
            }else if(value != '') this.probationContractInforForm.controls["contractTerm"].setValue('');
        });
    }

    getValidateRequire(value: any = '', key: string = '') {
        if(value?.laborContractStatus == 'EFFECT'){
            if(key == 'contractTerminationDate'){
                return [Validators.required];
            }else if(key == 'resultEvaluation'){
                return [Validators.required];
            }
        }
        return [];
    }

    loadEmployee() {
        this.employeeService.getEmployeeScreenCreateContract()
            .subscribe(({data} : any) => {
                let values = data;
                if(values && typeof values.map == "function"){
                    this.employees = values.map(el => {
                        el.label = el.employeeCode + '-' + el.fullName;
                        return el;
                    });
                    if(this.employeeId){
                        if(this.value?.employeeId){
                            this.employeeId = this.value.employeeId;
                        }
                        let employeeValue = this.employees.find(el => this.employeeId == el.employeeId);
                        this.onChangeEmployee(employeeValue);
                    }
                }
            }, (error: any) => {});
    }

    loadData() {
        this.setDefaultValue(this.value);
    }

    onClickButtonSave() {
        let employeeCode: string = "NA";
        if(this.data){
            employeeCode = this.data.employeeProfile.employeeCode;
        }else if(this.employeeCode){
            employeeCode = this.employeeCode;
        }else if(this.employeeSelected){
            employeeCode = this.employeeSelected.employeeCode
        }
        if (this.selectOption == this.collaboratorsContractType) {
            this.collaboratorsContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.collaboratorsContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.collaboratorsContractInforForm.valid) {
                let negotiableSalary = '0';
                let contractSalary = '0';
                if(this.collaboratorsContractInforForm.getRawValue().negotiableSalary){
                    negotiableSalary = ('' + this.collaboratorsContractInforForm.getRawValue().negotiableSalary).replace(/,/g, "");
                }
                if(this.collaboratorsContractInforForm.getRawValue().contractSalary){
                    contractSalary = ('' + this.collaboratorsContractInforForm.getRawValue().contractSalary).replace(/,/g, "");
                }
                let employeeId = '';
                if(this.collaboratorsContractInforForm.getRawValue()?.employee){
                    employeeId = this.collaboratorsContractInforForm.getRawValue()?.employee.employeeId;
                }
                if(!employeeId && this.employeeId) employeeId = this.employeeId;
                this.onSubmit.emit({
                    ...this.collaboratorsContractInforForm.getRawValue(), employeeCode, employeeId,
                    contractType: this.selectOption,negotiableSalary, contractSalary });
            }
        }
        else if (this.selectOption == this.formalContractType) {
            this.formalContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.formalContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.formalContractInforForm.valid) {
                let insuranceSalary = '0';
                let grossSalary = '0';
                let netSalary = '0';
                if(this.formalContractInforForm.getRawValue().insuranceSalary){
                    insuranceSalary = ('' + this.formalContractInforForm.getRawValue().insuranceSalary).replace(/,/g, "");
                }
                if(this.formalContractInforForm.getRawValue().grossSalary){
                    grossSalary = ('' + this.formalContractInforForm.getRawValue().grossSalary).replace(/,/g, "");
                }
                if(this.formalContractInforForm.getRawValue().netSalary){
                    netSalary = ('' + this.formalContractInforForm.getRawValue().netSalary).replace(/,/g, "");
                }
                let employeeId = '';
                if(this.formalContractInforForm.getRawValue()?.employee){
                    employeeId = this.formalContractInforForm.getRawValue()?.employee.employeeId;
                }
                if(!employeeId && this.employeeId) employeeId = this.employeeId;
                this.onSubmit.emit({
                    ...this.formalContractInforForm.getRawValue(),
                    contractType: this.selectOption, employeeId, 
                    insuranceSalary, grossSalary, netSalary, employeeCode,
                });
            }
        }
        else if (this.selectOption == this.probationContractType) {
            this.probationContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.probationContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.probationContractInforForm.valid) {
                let probationalSalary = '0';
                let officialSalary = '0';
                if(this.probationContractInforForm.getRawValue().probationalSalary){
                    probationalSalary = ('' + this.probationContractInforForm.getRawValue().probationalSalary).replace(/,/g, "");
                }
                if(this.probationContractInforForm.getRawValue().officialSalary){
                    officialSalary = ('' + this.probationContractInforForm.getRawValue().officialSalary).replace(/,/g, "");
                }
                let employeeId = '';
                if(this.probationContractInforForm.getRawValue()?.employee){
                    employeeId = this.probationContractInforForm.getRawValue()?.employee.employeeId;
                }
                if(!employeeId && this.employeeId) employeeId = this.employeeId; 
                this.onSubmit.emit({
                    ...this.probationContractInforForm.getRawValue(),  employeeCode, employeeId,
                    contractType: this.selectOption, probationalSalary, officialSalary });
            }
        }

    }

    onClickButtonSendApprove() {
        let employeeCode: string = "AN";
        if(this.data){
            employeeCode = this.data.employeeProfile.employeeCode;
        }else if(this.employeeCode){
            employeeCode = this.employeeCode;
        }
        if (this.selectOption == this.collaboratorsContractType) {
            this.collaboratorsContractInforForm.markAllAsTouched();
            this.collaboratorsContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.collaboratorsContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.collaboratorsContractInforForm.valid) {
                let employeeId = '';
                if(this.collaboratorsContractInforForm.getRawValue()?.employee){
                    employeeId = this.collaboratorsContractInforForm.getRawValue()?.employee.employeeId;
                }
                let negotiableSalary = '0';
                let contractSalary = '0';
                if(this.collaboratorsContractInforForm.getRawValue().negotiableSalary){
                    negotiableSalary = ('' + this.collaboratorsContractInforForm.getRawValue().negotiableSalary).replace(/,/g, "");
                }
                if(this.collaboratorsContractInforForm.getRawValue().contractSalary){
                    contractSalary = ('' + this.collaboratorsContractInforForm.getRawValue().contractSalary).replace(/,/g, "");
                }
                if(!this.value.laborContractPath && this.collaboratorsContractInforForm.value.laborContractPath == ""){
                    return this.toastr.error("Bắt buộc upload file", "Lỗi");
                }
                this.onSubmit.emit({ ...this.collaboratorsContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, employeeCode, employeeId, negotiableSalary, contractSalary });
            }
        }
        else if (this.selectOption == this.formalContractType) {
            this.formalContractInforForm.markAllAsTouched();
            this.formalContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.formalContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.formalContractInforForm.valid) {
                let employeeId = '';
                if(this.formalContractInforForm.getRawValue()?.employee){
                    employeeId = this.formalContractInforForm.getRawValue()?.employee.employeeId;
                }
                if(!this.value.laborContractPath && this.formalContractInforForm.value.laborContractPath == ""){
                    return this.toastr.error("Bắt buộc upload file", "Lỗi");
                }
                let insuranceSalary = '0';
                let grossSalary = '0';
                let netSalary = '0';
                if(this.formalContractInforForm.getRawValue().insuranceSalary){
                    insuranceSalary = ('' + this.formalContractInforForm.getRawValue().insuranceSalary).replace(/,/g, "");
                }
                if(this.formalContractInforForm.getRawValue().grossSalary){
                    grossSalary = ('' + this.formalContractInforForm.getRawValue().grossSalary).replace(/,/g, "");
                }
                if(this.formalContractInforForm.getRawValue().netSalary){
                    netSalary = ('' + this.formalContractInforForm.getRawValue().netSalary).replace(/,/g, "");
                }
                this.onSubmit.emit({ ...this.formalContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, employeeCode, employeeId, grossSalary, netSalary, insuranceSalary });
            }
        }
        else if (this.selectOption == this.probationContractType) {
            this.probationContractInforForm.markAllAsTouched();
            this.probationContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.probationContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            if (this.probationContractInforForm.valid) {
                let employeeId = '';
                if(this.probationContractInforForm.getRawValue()?.employee){
                    employeeId = this.probationContractInforForm.getRawValue()?.employee.employeeId;
                }
                let probationalSalary = '0';
                let officialSalary = '0';
                if(this.probationContractInforForm.getRawValue().probationalSalary){
                    probationalSalary = ('' + this.probationContractInforForm.getRawValue().probationalSalary).replace(/,/g, "");
                }
                if(this.probationContractInforForm.getRawValue().officialSalary){
                    officialSalary = ('' + this.probationContractInforForm.getRawValue().officialSalary).replace(/,/g, "");
                }
                if(!this.value.laborContractPath && this.probationContractInforForm.value.laborContractPath == ""){
                    return this.toastr.error("Bắt buộc upload file", "Lỗi");
                }
                this.onSubmit.emit({ ...this.probationContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, employeeCode, employeeId, probationalSalary, officialSalary });
            }
        }
    }

    onClickButtonApprove() {
        let employeeCode: string = "AN";
        if(this.data){
            employeeCode = this.data.employeeProfile.employeeCode;
        }else if(this.employeeCode){
            employeeCode = this.employeeCode;
        }
        if (this.selectOption == this.collaboratorsContractType) {
            this.collaboratorsContractInforForm.markAllAsTouched();
            this.collaboratorsContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.collaboratorsContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            let employeeId = '';
            if(this.collaboratorsContractInforForm.getRawValue()?.employee){
                employeeId = this.collaboratorsContractInforForm.getRawValue()?.employee.employeeId;
            }
            this.onApprove.emit({ ...this.collaboratorsContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "EFFECT", note: "", employeeCode, employeeId });
        }
        else if (this.selectOption == this.formalContractType) {
            this.formalContractInforForm.markAllAsTouched();
            this.formalContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.formalContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            let employeeId = '';
            if(this.formalContractInforForm.getRawValue()?.employee){
                employeeId = this.formalContractInforForm.getRawValue()?.employee.employeeId;
            }
            this.onApprove.emit({ ...this.formalContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "EFFECT", note: "", employeeCode, employeeId });
        }
        else if (this.selectOption == this.probationContractType) {
            this.probationContractInforForm.markAllAsTouched();
            this.probationContractInforForm.markAllAsTouched();
            const invalid = [];
            const controls = this.probationContractInforForm.controls;
            for (const name in controls) {
                if (controls[name].invalid) {
                    invalid.push(name);
                }
            }
            let employeeId = '';
            if(this.probationContractInforForm.getRawValue()?.employee){
                employeeId = this.probationContractInforForm.getRawValue()?.employee.employeeId;
            }
            this.onApprove.emit({ ...this.probationContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "EFFECT", note: "", employeeCode, employeeId });
        }
    }
    onClickReject() {
        this.rejectForm.reset();
        $("#reject_contract_approve_modal").modal("show");
    }
    cancelRejectApprove() {
        $("#reject_contract_approve_modal").modal("hide");
    }
    onClickSubmitReject() {
        this.rejectForm.markAllAsTouched();
        let employeeCode: string = "AN";
        if(this.data){
            employeeCode = this.data.employeeProfile.employeeCode;
        }else if(this.employeeCode){
            employeeCode = this.employeeCode;
        }
        if(this.rejectForm.valid){
            if (this.selectOption == this.collaboratorsContractType) {
                this.collaboratorsContractInforForm.markAllAsTouched();
                this.collaboratorsContractInforForm.markAllAsTouched();
                const invalid = [];
                const controls = this.collaboratorsContractInforForm.controls;
                for (const name in controls) {
                    if (controls[name].invalid) {
                        invalid.push(name);
                    }
                }
                let employeeId = '';
                if(this.collaboratorsContractInforForm.getRawValue()?.employee){
                    employeeId = this.collaboratorsContractInforForm.getRawValue()?.employee.employeeId;
                }
                this.onApprove.emit({ ...this.collaboratorsContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "UNAPPROVE", note: this.rejectForm.value.note, employeeCode, employeeId });
            }
            else if (this.selectOption == this.formalContractType) {
                this.formalContractInforForm.markAllAsTouched();
                this.formalContractInforForm.markAllAsTouched();
                const invalid = [];
                const controls = this.formalContractInforForm.controls;
                for (const name in controls) {
                    if (controls[name].invalid) {
                        invalid.push(name);
                    }
                }
                let employeeId = '';
                if(this.formalContractInforForm.getRawValue()?.employee){
                    employeeId = this.formalContractInforForm.getRawValue()?.employee.employeeId;
                }
                this.onApprove.emit({ ...this.formalContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "UNAPPROVE", note: this.rejectForm.value.note, employeeCode, employeeId });
            }
            else if (this.selectOption == this.probationContractType) {
                this.probationContractInforForm.markAllAsTouched();
                this.probationContractInforForm.markAllAsTouched();
                const invalid = [];
                const controls = this.probationContractInforForm.controls;
                for (const name in controls) {
                    if (controls[name].invalid) {
                        invalid.push(name);
                    }
                }
                let employeeId = '';
                if(this.probationContractInforForm.getRawValue()?.employee){
                    employeeId = this.probationContractInforForm.getRawValue()?.employee.employeeId;
                }
                this.onApprove.emit({ ...this.probationContractInforForm.getRawValue(), contractType: this.selectOption, isSendApproval: true, status: "UNAPPROVE", note: this.rejectForm.value.note, employeeCode, employeeId });
            }
            $('#reject_contract_approve_modal').modal('hide');
        }
    }

    onBlur(fieldName: string) {
        if (this.collaboratorsContractInforForm.value && typeof this.collaboratorsContractInforForm.value[fieldName] == "string") {
            this.collaboratorsContractInforForm.patchValue({ ...this.collaboratorsContractInforForm.value, [fieldName]: this.collaboratorsContractInforForm.value[fieldName].trim() });
        }
        if (this.formalContractInforForm.value && typeof this.formalContractInforForm.value[fieldName] == "string") {
            this.formalContractInforForm.patchValue({ ...this.formalContractInforForm.value, [fieldName]: this.formalContractInforForm.value[fieldName].trim() });
        }
        if (this.probationContractInforForm.value && typeof this.probationContractInforForm.value[fieldName] == "string") {
            this.probationContractInforForm.patchValue({ ...this.probationContractInforForm.value, [fieldName]: this.probationContractInforForm.value[fieldName].trim() });
        }
    }

    onBlurRejectApprove(){
        this.rejectForm.setValue({
            note: this.rejectForm.value.note.trim()
        })
    }

    onChangeCvFile(event) {
    }

    getFileName(value) {
        let result = '';
        if(value){
            let valueSplit = value.split('/');
            if(valueSplit[valueSplit.length - 1]){
                return valueSplit[valueSplit.length - 1];
            }
        }
        return result;
    }

    get getEmployeeInfoName() {
        if(this.value){
            return this.value?.employeeCode + "-" + this.value?.employeeName;
        }
        return ''
    }

    get fileUploadName() {
        if(this.value?.laborContractPath){
            let splitVal = this.value.laborContractPath.split("/");
            if(splitVal[splitVal.length - 1]){
                return splitVal[splitVal.length - 1];
            }
        }
        return '';
    }

    getDisabledFile(form: FormGroup) {
        return form.get('laborContractPath') ? form.get('laborContractPath').disabled : false;
    }

    onChangeTime(form: FormGroup) {
        let startDate = form.controls['startDate'].value;
        let month = form.controls['contractTerm'].value;
        form.controls['endDate'].patchValue(moment(startDate).add(month/1, "month").toDate());
    }

    get isShowTerminateDate() {
        return this.value?.laborContractStatus == 'EFFECT' || this.value?.laborContractStatus == 'EXPIRED';
    }


    canEditContractInfo() {
        let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        return hasPermission.length > 0;
    }

    canSendApprovalContract() {
        let hasPermission = this.roles.filter(role => role.code === ROLE_LIST.C_B);
        return hasPermission.length > 0;
    }

    canApprovalContract() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.CTO ||
            role.code === ROLE_LIST.CFO ||
            role.code === ROLE_LIST.CEO ||
            role.code === ROLE_LIST.CMO);
        return hasPermission.length > 0;
    }

    canCancelApprovalContract() {
        let hasPermission = this.roles.filter(role =>
            role.code === ROLE_LIST.COO ||
            role.code === ROLE_LIST.CTO ||
            role.code === ROLE_LIST.CFO ||
            role.code === ROLE_LIST.CEO ||
            role.code === ROLE_LIST.CMO);
        return hasPermission.length > 0;
    }

}
