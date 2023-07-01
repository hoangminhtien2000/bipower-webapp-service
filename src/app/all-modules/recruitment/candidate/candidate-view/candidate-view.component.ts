import {Component, OnInit, ViewChild} from '@angular/core';
import {PDFSource, PdfViewerComponent} from 'ng2-pdf-viewer';
import {BsModalRef} from "ngx-bootstrap/modal";
import {FileService} from "src/app/core/services/file.service";
import {MIME_TYPE} from "src/app/core/common/constant";
import * as FileSaver from 'file-saver';
import {TranslateService} from "@ngx-translate/core";
import {ToastrMessageService} from "src/app/core/services/toastr.message.service";

@Component({
  selector: 'app-candidate-view',
  templateUrl: './candidate-view.component.html',
  styleUrls: ['./candidate-view.component.scss']
})
export class CandidateViewComponent implements OnInit {
  @ViewChild(PdfViewerComponent) private pdfComponent: PdfViewerComponent;

  pdfSrc: string | PDFSource | ArrayBuffer;
  page = 1;
  zoom = 1;
  totalPages: number;
  isLoaded: boolean = false;
  fileId: number = 0;
  fileName: string = "";

  constructor(private bsModalRef: BsModalRef,
              private translate: TranslateService,
              public toastrMessage: ToastrMessageService,
              private fileService: FileService) {}

  ngOnInit() {

  }

  incrementPage(amount: number) {
    this.page += amount;
  }

  incrementZoom(amount: number) {
    this.zoom += amount;
  }

  afterLoadComplete(pdfData: any) {
    this.totalPages = pdfData.numPages;
    this.isLoaded = true;
  }

  nextPage() {
    this.page++;
  }

  prevPage() {
    this.page--;
  }

  closeModal(){
    this.bsModalRef.hide();
  }

  // downloadFile() {
  //   this.fileService.getFile(this.fileId).subscribe(res => {
  //     const data = this.fileService.convertBase64ToBlob(res.data.content, MIME_TYPE.PDF);
  //     const fileName = res.data.display_name;
  //     FileSaver.saveAs(data, fileName);
  //   }, error => {
  //     if (error.error && error.error.status && !error.error.status.success) {
  //       this.toastrMessage.showMessageError(error.error.status.code,
  //           error.error.status.message,
  //           this.translate.instant('shared.common-dialog.warning.title'));
  //     }
  //   });
  // }
}
