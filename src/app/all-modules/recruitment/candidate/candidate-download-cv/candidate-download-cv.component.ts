import {DatePipe} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import {BsModalRef} from 'ngx-bootstrap/modal';
import {ActivatedRoute, Router} from "@angular/router";
import {FileService} from "src/app/core/services/file.service";
import {CandidateService} from "src/app/core";
import {MIME_TYPE} from "src/app/core/common/constant";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
  selector: 'app-candidate-import-cv',
  templateUrl: './candidate-download-cv.component.html',
  styleUrls: ['./candidate-download-cv.component.scss']
})
export class CandidateDownloadCvComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private translate: TranslateService,
              private bsModalRef: BsModalRef,
              private datePipe: DatePipe,
              private router: Router,
              private fileService: FileService,
              public toastrMessage: ToastrMessageService,
              private candidateService: CandidateService,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnDestroy(): void {

  }
  ngOnInit() {
    let queryQ = this.activatedRoute.snapshot.queryParamMap.get('q');
    if (queryQ) {
      let fileId = atob(queryQ);
      this.fileService.getFile(Number(fileId)).subscribe(res => {
        if (res.data.extension) {
          let fileType = MIME_TYPE.PDF;
          if('pdf' == res.data.extension.toLowerCase()){
            fileType = MIME_TYPE.PDF;
          }
          if('doc' == res.data.extension.toLowerCase()){
            fileType = MIME_TYPE.DOC;
          }
          if('docx' == res.data.extension.toLowerCase()){
            fileType = MIME_TYPE.DOCX;
          }
          if('xlsx' == res.data.extension.toLowerCase()){
            fileType = MIME_TYPE.XLSX;
          }
          let data = this.fileService.convertBase64ToBlob(res.data.content, fileType);
          const fileName = res.data.display_name;
          FileSaver.saveAs(data, fileName);
          this.router.navigate(['layout/recruitment/candidate']);
        }
      }, error => {
        if (error.error && error.error.status && !error.error.status.success) {
          this.toastrMessage.showMessageError(error.error.status.code,
              error.error.status.message,
              this.translate.instant('shared.common-dialog.warning.title'));
        }
      })
    }
  }

  fileLeave(event: any){

  }

  fileOver(event: any){

  }
}
