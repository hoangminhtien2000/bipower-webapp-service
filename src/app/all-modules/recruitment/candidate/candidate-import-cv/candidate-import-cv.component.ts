import {DatePipe} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ToastrService} from 'ngx-toastr';
import {Router} from "@angular/router";
import {FileService} from "src/app/core/services/file.service";
import {CandidateFileDetailModel} from "src/app/core/models/candidate.file.detail.model";
import {CandidateService} from "src/app/core";
import {MIME_TYPE, TEMPLATE} from "src/app/core/common/constant";
import {CommonDialogComponent} from "src/app/sharing/common-dialog/common-dialog.component";
import {NotifyType} from "src/app/core/common/notify-type";
import {CONFIG} from "src/app/core/config/application.config";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

const MAX_FILE_SIZE_TEMPLATE = (1024 * 1024 * CONFIG.CANDIDATE.MAX_SIZE_IMPORT_CV);

@Component({
  selector: 'app-candidate-import-cv',
  templateUrl: './candidate-import-cv.component.html',
  styleUrls: ['./candidate-import-cv.component.scss']
})
export class CandidateImportCvComponent implements OnInit {
  total: string;
  success: any;
  datas: any = [];
  errors: any;
  note: string = null;
  refileView: boolean = false;
  resultImport: boolean = false;
  fileNameTemplate: string = '';
  isEnableDownloadErrorFile = false;
  totalRecord: number = 25;
  totalRecordSuccess: number = 3;
  totalRecordFailure: number = 22;
  fileImport: any;
  drafFileImport: any;
  fileResponseImport: CandidateFileDetailModel;
  contentResult: string = '';
  @ViewChild('confirmDialog') confirmDialog: CommonDialogComponent;

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private bsModalRef: BsModalRef,
              private datePipe: DatePipe,
              private router: Router,
              private fileService: FileService,
              public toastrMessage: ToastrMessageService,
              private candidateService: CandidateService) {
  }

  ngOnDestroy(): void {

  }
  async ngOnInit() {
  }

  handleFile($event: any) {
    const file = $event.target.files[0];
    if (!CONFIG.CANDIDATE.FILE_TYPE_IMPORT_CV.includes(file.type)) {
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
    this.uploadAndValidate(file);
  }

  downloadTemplate() {
    this.fileService.getTemplate(TEMPLATE.IMPORT_CANDIDATE).subscribe(res => {
      const data = this.fileService.convertBase64ToBlob(res.data.content, MIME_TYPE.XLSX);
      const fileName = res.data.display_name;
      FileSaver.saveAs(data, fileName);
    }, error => {
      if (error.error && error.error.status && !error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    })
  }

  confirmImportFileCandidate() {
    if (!this.fileImport || this.fileImport.size == 0) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.not_exists_file'),
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }

    this.confirmDialog.openModal(null, null, {
      type: NotifyType.warn,
      title: this.translate.instant('candidate.confirm.import.title'),
      message: this.translate.instant('candidate.confirm.import.message')
    });
  }

  importFileCandidate() {
    this.fileService.convertFileToBase64(this.fileImport).subscribe(data => {
      let fileModel: CandidateFileDetailModel = new CandidateFileDetailModel();
      fileModel.name = this.fileNameTemplate;
      fileModel.content = data;
      this.candidateService.import(fileModel).subscribe(res => {
        this.fileResponseImport = res.data.file;
        this.totalRecord = res.data.fail + res.data.success;
        this.totalRecordFailure = res.data.fail;
        this.totalRecordSuccess = res.data.success;
        this.contentResult = res.data.file.content;
        this.resultImport = true;
      }, error => {
        if (error.error && error.error.status && !error.error.status.success) {
          this.toastrMessage.showMessageError(error.error.status.code,
              error.error.status.message,
              this.translate.instant('shared.common-dialog.warning.title'));
          this.resultImport = false;
        }
      });
    });
  }

  dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry: FileSystemFileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
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
          this.uploadAndValidate(file);
        });
      }
    }
  }

  uploadAndValidate(file: any) {
    if (file.size > MAX_FILE_SIZE_TEMPLATE) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.max_size_file_upload',
              {maxMB: CONFIG.CANDIDATE.MAX_SIZE_UPLOAD_MB}),
          this.translate.instant('shared.common-dialog.warning.title'));
      return;
    }
    this.refileView = true;
    this.fileNameTemplate = file.name;
    this.total = this.datas.length;
    this.success = true;
    this.errors = false;
    this.isEnableDownloadErrorFile = true;
    this.fileImport = file;
    this.resultImport = false;
  }

  confirmImportSuccess() {
    this.uploadAndValidate(this.drafFileImport);
  }

  fileLeave(event: any){

  }

  fileOver(event: any){

  }

  comeBackCandidateList() {
    this.router.navigate(['layout/recruitment/candidate']);
  }

  downloadFileResponse() {
    if (!this.contentResult) {
      return;
    }
    const data = this.fileService.convertBase64ToBlob(this.contentResult, MIME_TYPE.XLSX);
    const fileName = this.fileResponseImport.display_name;
    FileSaver.saveAs(data, fileName);
  }
}
