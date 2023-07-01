import {Component, OnInit, ViewChild} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {TranslateStorage} from "../../../core/storage/translate.storage";
import * as FileSaver from 'file-saver';
import {COMMON, MIME_TYPE, TEMPLATE} from "../../../core/common/constant";
import {FileService} from "../../../core/services/file.service";
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {NotifyType} from "../../../core/common/notify-type";
import {ToastrService} from "ngx-toastr";
import {CommonDialogComponent} from "../../../sharing/common-dialog/common-dialog.component";
import {Router} from "@angular/router";
import {EmployeeService} from "../../../core";
import {BsModalRef} from 'ngx-bootstrap/modal';
import {CandidateFileDetailModel} from "../../../core/models/candidate.file.detail.model";
import {environment} from "../../../../environments/environment";
import {ToastrMessageService} from "../../../core/services/toastr.message.service";

const MAX_FILE_SIZE_TEMPLATE = (1024 * 1024 * 5);

@Component({
    selector: 'app-employee-import',
    templateUrl: './employee-import.component.html',
    styleUrls: ['./employee-import.component.scss']
})
export class EmployeeImportComponent implements OnInit {
    @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;
    refileView: boolean = false;
    fileNameTemplate: string = '';
    resultImport: boolean = false;
    total: string;
    success: any;
    datas: any = [];
    errors: any;
    fileImport: any;
    drafFileImport: any;
    isEnableDownloadErrorFile = false;
    // fileResponseImport: EmployeeFileDetailModel;
    private file: File = null;
    private fileUpload: any;
    files = [];
    form;
    public fileReport = null;
    public fileName = null;
    totalRows: number = 25;
    totalRowPass: number = 3;
    totalRowFail: number = 22;
    baseUrlApi = environment.baseUrlApi;
    isLoadingSpiner: boolean = false;

    constructor(
        private translate: TranslateService,
        private translateStorage: TranslateStorage,
        private fileService: FileService,
        private toastrService: ToastrService,
        private bsModalRef: BsModalRef,
        private router: Router,
        public toastrMessage: ToastrMessageService,
        private employeeService: EmployeeService,
    ) {
    }

    ngOnInit(): void {
    }

    downloadTemplate() {
        this.employeeService.getTemplate().subscribe(res => {
            const data = this.fileService.convertBase64ToBlob(res.data, MIME_TYPE.XLSX);
            FileSaver.saveAs(data, "Import_employee_profile_template.xlsx");
        })
    }

    dropped(files: NgxFileDropEntry[]) {
        for (const droppedFile of files) {
            if (droppedFile.fileEntry.isFile) {
                const fileEntry: FileSystemFileEntry = droppedFile.fileEntry as FileSystemFileEntry;
                fileEntry.file((file: File) => {
                    if (this.fileNameTemplate) {
                        this.modelConfirmResetValidate(file);
                    } else {
                        this.uploadAndValidate(file);
                    }
                });
            }
        }
    }

    modelConfirmResetValidate(file: any) {
        if (file.size > MAX_FILE_SIZE_TEMPLATE) {
            this.toastrService.error(this.translate.instant('candidate.message.max_size_file_upload', this.translate.instant('shared.common-dialog.warning.title')));
            return;
        }
        if (file.type != MIME_TYPE.XLSX && file.type != MIME_TYPE.XLS) {
            this.toastrMessage.showMessageError(null,
                this.translate.instant('candidate.message.template_import_format'),
                this.translate.instant('shared.common-dialog.warning.title'));
            return;
        }
        if (!file || file.size == 0) {
            this.toastrMessage.showMessageError(null,
                this.translate.instant('candidate.message.not_exists_file'),
                this.translate.instant('shared.common-dialog.warning.title'));
            return false;
        }
        this.drafFileImport = file;

        this.confirmDialog.openModal(null, null, {
            type: NotifyType.warn,
            message: 'employees.import.overwrite'
        });
    }

    comeBackEmployeeList() {
        this.router.navigate(['layout/employees/employeelist']);
    }

    validateImport() {
        if (!this.fileImport || this.fileImport.size == 0) {
            this.toastrMessage.showMessageError(null,
                this.translate.instant('candidate.message.when_no_file'),
                this.translate.instant('shared.common-dialog.warning.title'));
            return;
        }
    }

    importFileEmployee() {
        this.validateImport()
        if (this.refileView) {
            const formData = new FormData();
            this.isLoadingSpiner = true;
            formData.append('file', this.file);
            this.fileService.convertFileToBase64(this.fileImport).subscribe(data => {
                let fileModel: CandidateFileDetailModel = new CandidateFileDetailModel();
                fileModel.name = this.fileNameTemplate;
                fileModel.content = data;
                this.employeeService.import(formData).subscribe(res => {
                    this.fileName = res.fileName;
                    this.totalRows = res.totalRowFail + res.totalRowPass;
                    this.totalRowFail = res.totalRowFail;
                    this.totalRowPass = res.totalRowPass;
                    this.fileReport = res.fileReport;
                    this.resultImport = true;
                    this.isLoadingSpiner = false
                }, error => {
                    if (error.error && error.error.status && !error.error.status.success) {
                        this.toastrService.error(error.error.status.message, this.translateStorage.translateKey(COMMON.WARNING.TITLE));
                        this.isLoadingSpiner = false
                    }
                })
            });
        }
    }

    handleFile($event: any) {
        const file = $event.target.files[0];
        this.file = file
        if (this.fileNameTemplate) {
            this.modelConfirmResetValidate(file);
        } else {
            this.uploadAndValidate(file);
        }
    }

    confirmImportSuccess() {
        this.uploadAndValidate(this.drafFileImport);
    }

    uploadAndValidate(file: any) {
        if (file.type != MIME_TYPE.XLSX && file.type != MIME_TYPE.XLS) {
            this.toastrMessage.showMessageError(null,
                this.translate.instant('candidate.message.template_import_format'),
                this.translate.instant('shared.common-dialog.warning.title'));
            return;
        }
        if (!file || file.size == 0) {
            this.toastrMessage.showMessageError(null,
                this.translate.instant('candidate.message.not_exists_file'),
                this.translate.instant('shared.common-dialog.warning.title'));
            return false;
        }
        if (file.size > MAX_FILE_SIZE_TEMPLATE) {
            this.toastrService.error("employees.import.capacity");
            return;
        }
        this.refileView = true;
        this.fileNameTemplate = file.name;
        this.total = this.datas.length;
        this.success = true;
        this.errors = false;
        this.isEnableDownloadErrorFile = true;
        this.fileImport = file;
    }

    downloadFileResponse() {
        // fileReport
        const data = this.fileService.convertBase64ToBlob(this.fileReport, MIME_TYPE.XLSX);
        // // const fileName = res.data.display_name;
        FileSaver.saveAs(data, this.fileName);
    }
}
