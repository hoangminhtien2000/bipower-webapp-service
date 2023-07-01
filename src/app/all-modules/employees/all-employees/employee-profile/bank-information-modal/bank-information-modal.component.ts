import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import { Constant } from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
declare const $: any;

@Component({
    selector: "app-bank-information-modal",
    templateUrl: "./bank-information-modal.component.html",
    styleUrls: ["./bank-information-modal.component.css"],
})
export class BankInformationModalComponent implements OnInit, OnChanges, AfterViewInit {
    public brankInforForm: FormGroup;
    public bankListForm: FormGroup;
    @Input()
    public idModal: string =  "bank-information-modal";
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
            this.generateFormList();
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if(changes.value){
            this.loadData();
        }
    }

    setDefaultValue(value: any) {
        this.addItem(value);
    }

    ngOnInit() {
        this.generateFormList();
        this.addItem();
    }
    generateFormList() {
        this.bankListForm = this.formBuilder.group({
            list: this.formBuilder.array([])
        });
    }

    addItem(value: any = null) {
        const brankInforForm = this.formBuilder.group({
            id: [value?.id ? value.id: null, []],
            bankName: [value?.bankName ? value.bankName: "", [Validators.required, Validators.maxLength(100)]],
            accountNo: [value?.accountNo ? value.accountNo: "", [Validators.required, Validators.maxLength(20), Validators.pattern('[0-9]+')]],
            branchName: [value?.branchName ? value.branchName: "", [Validators.maxLength(50)]],
        });
        this.listBankForm?.push(brankInforForm);
    }
    removeItem(index: number){
        this.listBankForm.removeAt(index);
    }

    get listBankForm() {
        return this.bankListForm?.controls['list'] as FormArray;
    }

    loadData() {
        if(this.value && this.value.length > 0){
            for(let index = 0; index < this.value.length; index++){
                this.addItem(this.value[index]);
            }
        }else{
            this.addItem();
        }
    }

    onClickButtonSave() {
        this.bankListForm.markAllAsTouched();
        if (this.bankListForm.valid) {
            this.onSubmit.emit(this.bankListForm.value.list);
        }
    }

    onBlur(fieldName: string, index: number) {
        if(this.bankListForm.value && typeof this.bankListForm.value){
            const list = this.bankListForm.value.list;
            if(list[index][fieldName]){
                list[index][fieldName] = list[index][fieldName].trim();
            }
            this.bankListForm.setValue({
                list: list
            })
        }
    }

    onClickCancel() {
        $('#' + this.idModal).modal('hide');
    }

}
