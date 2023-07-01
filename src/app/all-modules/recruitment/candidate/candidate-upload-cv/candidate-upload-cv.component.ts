import {DatePipe} from "@angular/common";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from '@angular/router';
import {FormlyFieldConfig} from "@ngx-formly/core";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";
import {BehaviorSubject} from "rxjs";
import {CandidateFileDetailModel} from "src/app/core/models/candidate.file.detail.model";
import {FileService} from "src/app/core/services/file.service";
import {CandidateService} from "src/app/core";
import {CandidateFileModel} from "src/app/core/models/candidate.file.model";
import {CandidateUploadCvModel} from "src/app/core/models/candidate.upload.cv.model";
import {CandidateImportCvModel} from "src/app/core/models/candidate.import.cv.model";
import {CONFIG} from "src/app/core/config/application.config";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
  selector: 'app-candidate-upload-cv',
  templateUrl: './candidate-upload-cv.component.html',
  styleUrls: ['./candidate-upload-cv.component.scss']
})
export class CandidateUploadCvComponent implements OnInit, OnDestroy  {

  constructor(
      private formBuilder: FormBuilder,
      private candidateService: CandidateService,
      private toastr: ToastrService,
      private datePipe: DatePipe,
      private router: Router,
      public fileService: FileService,
      public toastrMessage: ToastrMessageService,
      private translate: TranslateService
  ) {}

  fileCVCandidates: any[] = [];
  fileCVUploadCandidates: any[] = [];
  candidateFileCvUploads: CandidateFileModel[][] = [];

  candidateUploadCvKeys: number[] = [];
  candidateUploadCvItem: number = 0;


  candidateFields: FormlyFieldConfig[][] = [];
  candidateForms: FormGroup[] = [];
  candidateModels: any[] = [];
  uploadCVSubject = new BehaviorSubject<Number>(0);

  candidateUploadCvModels: CandidateUploadCvModel[] = [];

  ngOnInit() {
    this.onAddCandidate();
    this.uploadCVSubject.subscribe(data => {
      if (this.checkUploadDone()) {
        let importcvs: CandidateImportCvModel[] = [];
        for(var index = 0; index< this.candidateModels.length; index++){
          let candidateImportCvModel: CandidateImportCvModel = new CandidateImportCvModel();
          candidateImportCvModel.files = this.candidateFileCvUploads[index];
          candidateImportCvModel.candidate_id = this.candidateModels[index].candidateId;
          importcvs.push(candidateImportCvModel);
        }
        this.candidateService.importCV(importcvs).subscribe(data => {
          if (data.status.success) {
            this.toastrMessage.showMessageSuccess(data.status.message, this.translate.instant('shared.common-dialog.info.title'));
          }
        }, error => {
          if (error.error && error.error.status && !error.error.status.success) {
            this.toastrMessage.showMessageError(error.error.status.code,
                error.error.status.message,
                this.translate.instant('shared.common-dialog.warning.title'));
          }
        });
      }
    });
  }

  private checkUploadDone(): boolean{
    for (var index: number = 0; index < this.candidateModels.length; index++) {
      if(!this.candidateFileCvUploads[index]
          || this.candidateFileCvUploads[index].length == 0
          || !this.fileCVUploadCandidates[index]
          || this.fileCVUploadCandidates[index].length ==  0
          || this.fileCVUploadCandidates[index].length != this.candidateFileCvUploads[index].length){
        return false;
      }
    }
    return true;
  }

  ngOnDestroy(): void {
  }

  onUploadCV() {
    this.candidateFileCvUploads = [];
    for (var index = 0; index<this.fileCVUploadCandidates.length; index++) {
      let fileCVUploads = this.fileCVUploadCandidates[index];
      this.candidateFileCvUploads.push([]);
      for (let file of fileCVUploads) {
        if (file.fileId && file.fileId > 0) {
          let candidateFile: CandidateFileModel = new CandidateFileModel();
          candidateFile.file_id = file.fileId;
          this.candidateFileCvUploads[index].push(candidateFile);
          this.uploadCVSubject.next(1);
        } else {
          this.fileService.convertFileToBase64(file.fileContent).subscribe(data => {
            let candidateUploadCvModel: CandidateUploadCvModel = this.candidateUploadCvModels[file.indexCandidate];
            candidateUploadCvModel.file = new CandidateFileDetailModel();
            candidateUploadCvModel.file.name = file.fileName;
            candidateUploadCvModel.file.content = data;
            this.candidateService.uploadCV(candidateUploadCvModel).subscribe(data => {
              let candidateFile: CandidateFileModel = new CandidateFileModel();
              candidateFile.file_id = data.data.file_id;
              file.fileId = data.data.file_id;
              this.candidateFileCvUploads[file.indexCandidate].push(candidateFile);
              this.uploadCVSubject.next(1);
              data.data.file_id;
            }, error => {
              if (error.error && error.error.status && !error.error.status.success) {
                this.toastrMessage.showMessageError(error.error.status.code,
                    error.error.status.message,
                    this.translate.instant('shared.common-dialog.warning.title'));
              }
            });
          });
        }
      }
    }
  }

  onLoadCV(candidateId: number, keyIndexCandidate: number) {
    this.candidateService.getCV(candidateId).subscribe(data=>{
      let fileCVs: any[] = [];
      for (var file of data.data.files) {
        let fileContent: any = {
          fileName: file.file.display_name,
          urlDowload: file.file.file_id,
          fileId: file.file.file_id,
          keyIndexCandidate: keyIndexCandidate
        };
        fileCVs.push(fileContent);
      }
      let indexCandidate = this.getIndexOfCandidateFileCv(keyIndexCandidate);
      this.fileCVCandidates[indexCandidate] = fileCVs;
      this.fileCVUploadCandidates[indexCandidate] = fileCVs;
    }, error => {
      this.toastrMessage.showMessageError(error.error.status.code,
          error.error.status.message,
          this.translate.instant('shared.common-dialog.warning.title'));
    });
  }

  onChangeFile(event: any[]): void {
    if (event.length > 0) {
      this.fileCVUploadCandidates[event[0].indexCandidate] = event;
    }
  }

  checkExistAddCandidate() {
    if (this.candidateModels.length < CONFIG.CANDIDATE.MAX_UPLOAD_CV) {
      return true;
    }
    return false;
  }

  onAddCandidate() {
    this.candidateUploadCvItem++;
    this.candidateUploadCvKeys.push(this.candidateUploadCvItem);
    let keyIndexCandidate = this.candidateUploadCvItem;

    let candidateIdField: FormlyFieldConfig = {
      type: 'autocomplete',
      key: 'candidateId',
      templateOptions: {
        label: this.translate.instant('candidate.upload_cv.candidate'),
        placeholder: this.translate.instant('candidate.upload_cv.candidate_placeholder'),
        valueKey: 'candidate_id',
        labelKey: 'display',
        required:true,
        api: {
          url: CONFIG.API.CANDIDATE_LIST,
          lazySearch: 'query',
          responsePath: 'data',
          params: {
            page: 0,
            page_size: 10
          }
        }
      },
      hooks: {
        onInit: (field) => {
          field.formControl.valueChanges.subscribe(candidateId => {
            if (candidateId > 0) {
              if (this.checkDuplicateCandidate(candidateId)) {
                this.toastrMessage.showMessageError(null,
                    this.translate.instant('candidate.message.duplicate_candidate'),
                    this.translate.instant('shared.common-dialog.warning.title'));
                field.formControl.reset();
              } else {
                this.updateByLoadCandidateDetail(candidateId, keyIndexCandidate);
              }
            } else {
              let indexCandidate = this.getIndexOfCandidateFileCv(keyIndexCandidate);
              this.fileCVCandidates[indexCandidate] = [];
              this.fileCVUploadCandidates[indexCandidate] = [];
            }
          });
        }
      }
    }

    let candidateField: FormlyFieldConfig[] = [
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          candidateIdField
        ]
      }
    ];

    let candidateForm: FormGroup = new FormGroup({});

    this.candidateFields.push(candidateField);
    this.candidateForms.push(candidateForm);

    this.candidateModels.push({});

    this.fileCVCandidates.push([]);
    this.fileCVUploadCandidates.push([]);
    this.candidateFileCvUploads.push([]);
    this.candidateUploadCvModels.push(new CandidateUploadCvModel());
  }

  private updateByLoadCandidateDetail(candidateId: number, keyIndexCandidate) {
    this.candidateService.detailByCandidateId(candidateId.toString()).subscribe(data => {
      let indexCandidate = this.getIndexOfCandidateFileCv(keyIndexCandidate);
      this.candidateUploadCvModels[indexCandidate] = data.data;
      this.onLoadCV(candidateId, keyIndexCandidate);
    });
  }

  comeBackCandidateList() {
    this.router.navigate(['layout/recruitment/candidate']);
  }

  updateCVCandidate() {
    for(var itemFrom of this.candidateForms){
      itemFrom.markAllAsTouched();
      if(itemFrom.invalid){
        return;
      }
    }

    for (let files of this.fileCVUploadCandidates) {
      if (files && files.length == 0) {
        this.toastrMessage.showMessageError(null,
            this.translate.instant('candidate.message.file_cv_not_exits'),
            this.translate.instant('shared.common-dialog.warning.title'));
        return;
      }
    }

    this.onUploadCV();
  }

  onRemoveCandidate(index) {
    this.candidateFields.splice(index, 1);
    this.candidateForms.splice(index, 1);

    this.candidateModels.splice(index, 1);

    this.fileCVCandidates.splice(index, 1);
    this.fileCVUploadCandidates.splice(index, 1);
    this.candidateFileCvUploads.splice(index, 1);
    this.candidateUploadCvModels.splice(index, 1);
    this.candidateUploadCvKeys.splice(index, 1);
  }

  checkDuplicateCandidate(candidateId: number): boolean {
    let countCandidateId: number = 0;
    for (var candidateModel of this.candidateModels) {
      if (candidateModel.candidateId == candidateId) {
        countCandidateId++;
      }
    }
    if (countCandidateId > 1) {
      return true;
    }
    return false;

  }

  getIndexOfCandidateFileCv(key: number){
    return this.candidateUploadCvKeys.indexOf(key);
  }
}
