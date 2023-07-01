import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { EnumStoredService, ENUM } from "src/app/core/services/enum.service";
import {
    Constant,
    RequireTypeFile
} from "src/app/core/helper/validator-custom/ValidatorCustom";
import { environment } from "src/environments/environment";
import { URL_IMAGE_PREV } from "src/app/core/common/constant";
declare const $: any;

@Component({
    selector: "app-storage-profile-modal",
    templateUrl: "./storage-profile-modal.component.html",
    styleUrls: ["./storage-profile-modal.component.css"],
})
export class StorageProfileModalComponent implements OnInit, OnChanges, AfterViewInit {
    public storageProfileForm: FormGroup;
    @Input()
    public idModal: string = "storage-profile-modal";
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
    public domainUrl = URL_IMAGE_PREV.url;
    public typeFiles = ['pdf'];
    public typeImage = ['png', 'jpg', 'jpeg'];
    public maxLength:number = 37;

    public listCv: any[] = [];
    public listCvShow: any[] = [];
    public listIdDeleteFile: any[] = []; 


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
            this.listIdDeleteFile = [];
            $('#' + this.idModal + ' input[type=file]').each((index, element) => {
                $(element).val('');
            })
            this.loadData();
        })
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes.value) {
            this.loadData();
        }
    }

    setDefaultValue(value: any = null) {
        this.storageProfileForm = this.formBuilder.group({
            id: value?.id ? value.id : null,
            profileFile: ["", [...this.getValidateRequire('profileFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// cv Tiếng anh
            cvFile: ["", [...this.getValidateRequire('cvFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// cv Tiếng anh
            cvEnFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// cv Tiếng anh
            sylsFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// sơ yếu lý lịch
            graduateDegreeFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// bằng tốt nghiệp
            // identityFile: [ "", [...this.getValidateRequire('identityFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles, true)]],// cccd
            identityFrontSideFile: [ "", [...this.getValidateRequire('identityFrontSideFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeImage)]],// anh mat truoc
            identityBackSideFile: [ "", [...this.getValidateRequire('identityBackSideFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeImage)]],// anh mat sau
            certificateFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile([...this.typeImage, ...this.typeFiles], true)]],// chứng chỉ
            socialInsuranceFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles)]],// Sổ bảo hiểm
            avatarFile: ["", [...this.getValidateRequire('avatarFile', value), RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeImage)]],// Sổ bảo hiểm
            dependentPersonFile: ["", [RequireTypeFile.maxSizeFile(5), RequireTypeFile.typeFile(this.typeFiles, true)]],// Hồ sơ người phụ thuộc
        });
    }

    getValidateRequire(fieldName: string = '', array: any[] = []) {
        const finder = array?.find(el => el.catalogName == fieldName);
        if(finder){
            return [];
        }
        return [Validators.required];
    }

    ngOnInit() {
        this.setDefaultValue(null);

    }

    loadData() {
        this.setDefaultValue(this.value);
    }

    onClickButtonSave() {
        this.storageProfileForm.markAllAsTouched();
        if (this.storageProfileForm.valid) {
            this.onSubmit.emit({ ...this.storageProfileForm.value, listIdDeleteFile: this.listIdDeleteFile });
        }
        
    }

    onCancel() {
        $("#" + this.idModal).modal('hide');
    }

    getListFile(key: string) {
        let list: any = [];
        for(let index = this.value?.length - 1; index >= 0; index--){
            if(this.listIdDeleteFile.indexOf(this.value[index].id) >= 0){
                continue;
            }
            if(this.value[index]?.catalogName == key){
                const finder = this.value[index];
                if(finder){
                    let filePathList = finder.filePath.split('/');
                    finder.fileName = filePathList[filePathList?.length - 1];
                }
                list.push(finder);
            }
        }
        return list;
    }
    removeFileAt(id: number = 0, key: string = '') {
        if(key){
            let formArray = Array.from(this.storageProfileForm.controls[key].value);
            formArray.splice(id, 1);
            this.storageProfileForm.controls[key].patchValue(formArray);
        }else{
            this.listIdDeleteFile.push(id);
        }
    }

    getFileName(key: string) {
        let finder = null;
        for(let index = this.value?.length - 1; index >= 0; index--){
            if(this.value[index]?.catalogName == key){
                finder = this.value[index];
                break;
            }
        }
        if(finder){
            let filePathList = finder.filePath.split('/');
            return filePathList[filePathList?.length - 1];
        }
        return '';
    }
    getFilePath(catalogName: string) {
        let finder = null;
        for(let index = this.value?.length - 1; index >= 0; index--){
            if(this.value[index]?.catalogName == catalogName){
                finder = this.value[index];
                break;
            }
        }
        if(finder){
            return finder.filePath;
        }
        return '';
    }

}
