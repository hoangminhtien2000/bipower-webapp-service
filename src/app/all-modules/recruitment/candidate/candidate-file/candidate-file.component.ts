import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FileSystemFileEntry, NgxFileDropEntry} from "ngx-file-drop";
import {CONFIG} from "src/app/core/config/application.config";
import {TranslateService} from "@ngx-translate/core";
import {MIME_TYPE} from "src/app/core/common/constant";
import * as FileSaver from 'file-saver';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {CandidateViewComponent} from "../candidate-view/candidate-view.component";
import {FileService} from "src/app/core/services/file.service";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

const MAX_FILE_SIZE_TEMPLATE = (1024 * 1024 * CONFIG.CANDIDATE.MAX_SIZE_UPLOAD_MB);

@Component({
  selector: 'app-candidate-file',
  templateUrl: './candidate-file.component.html',
  styleUrls: ['./candidate-file.component.scss']
})
export class CandidateFileComponent implements OnInit, AfterViewInit {

  serialByFile = '';

  @Input() fileCVs: any[] = [];
  @Input() keyIndexCandidate: number = 0;
  @Input() requiredFileCV: boolean = true;

  @ViewChild('fileInput') myInputVariable: ElementRef;
  @Output() onChangeFile = new EventEmitter<any[]>();
  modalRef: BsModalRef;

  constructor(private modalService: BsModalService,
              private fileService: FileService,
              public toastrMessage: ToastrMessageService,
              private translate: TranslateService) {
  }


  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  private validateFile(file: any): boolean{
    if (!CONFIG.CANDIDATE.FILE_TYPE_UPLOAD_CV.includes(file.type)) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.file_cv_format'),
          this.translate.instant('shared.common-dialog.warning.title'));
      return false;
    }
    if (this.fileCVs.length >= CONFIG.CANDIDATE.MAX_UPLOAD_CV) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.file_cv_max', {maxFile: CONFIG.CANDIDATE.MAX_UPLOAD_CV}),
          this.translate.instant('shared.common-dialog.warning.title'));
      return false;
    }
    if (file.size > MAX_FILE_SIZE_TEMPLATE) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.max_size_file_upload',
              {maxMB: CONFIG.CANDIDATE.MAX_SIZE_UPLOAD_MB}),
          this.translate.instant('shared.common-dialog.warning.title'));
      return false;
    }
    if (!file || file.size == 0) {
      this.toastrMessage.showMessageError(null,
          this.translate.instant('candidate.message.not_exists_file'),
          this.translate.instant('shared.common-dialog.warning.title'));
      return false;
    }
    return true;
  }

  onFileUpload(event: any) {
    for (var fileInfo of event.target.files) {
      if(!this.validateFile(fileInfo)){
        return;
      }
      let dataFile: any = {
        fileName: fileInfo.name,
        urlDowload: fileInfo.urlDowload,
        fileId: fileInfo.fileId,
        fileContent: fileInfo,
        indexCandidate: this.keyIndexCandidate
      };
      if(this.fileCVs.length == 0){
        this.fileCVs = [];
      }
      this.fileCVs.push(dataFile);
    }
    this.onChangeFile.emit(this.fileCVs);
    if (this.myInputVariable?.nativeElement) {
      this.myInputVariable.nativeElement.value = '';
    }
  }

  dragDropFile(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry: FileSystemFileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          if(!this.validateFile(file)){
            return;
          }
          let dataFile: any = {
            fileName: file.name,
            urlDowload: null,
            fileId: null,
            fileContent: file,
            indexCandidate: this.keyIndexCandidate
          }
          this.fileCVs.push(dataFile);
        });
      }
    }
  }

  onRemoveFile(index: number) {
    this.fileCVs.splice(index, 1);
    this.onChangeFile.emit(this.fileCVs);
  }

  onDownloadFile(index: number) {
    this.fileService.getFile(this.fileCVs[index].fileId).subscribe(data => {
      if (data.data.extension && 'pdf' == data.data.extension.toLowerCase()) {
        const blob = this.fileService.convertBase64ToBlob(data.data.content, MIME_TYPE.PDF);
        this.modalRef = this.modalService.show(CandidateViewComponent, {
          initialState: {
            pdfSrc: URL.createObjectURL(blob),
            fileName: data.data.display_name,
            fileId: this.fileCVs[index].fileId
          },
          class: 'modal-left modal-dialog-centered w-70 max-width-modal expand',
          ignoreBackdropClick: true
        });
      } else {
        const file = this.fileService.convertBase64ToBlob(data.data.content, MIME_TYPE.DOC);
        const fileName = data.data.display_name;
        FileSaver.saveAs(file, fileName);
      }
    }, error => {
      if (error.error && error.error.status && !error.error.status.success) {
        this.toastrMessage.showMessageError(error.error.status.code,
            error.error.status.message,
            this.translate.instant('shared.common-dialog.warning.title'));
      }
    });
  }

  isExistFile(){
    return this.fileCVs.length > 0;
  }

  fileLeave(event: any){

  }

  fileOver(event: any){

  }
}
