import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PDFSource, PdfViewerComponent } from 'ng2-pdf-viewer';
import { EmployeeService } from 'src/app/core';
import { FileService } from 'src/app/core/services/file.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-file-preview',
  templateUrl: './file-preview.component.html',
  styleUrls: ['./file-preview.component.css']
})
@HostListener('window: resize', ['$event'])
export class FilePreviewComponent implements OnInit {

  public innerHeight: any;
  getScreenHeight() {
    this.innerHeight = window.innerHeight + 'px';
  }
  pdfSrc: string | PDFSource | ArrayBuffer;
  imageSrc: string | PDFSource | ArrayBuffer;
  page = 1;
  zoom = 1;
  totalPages: number;
  isLoaded: boolean = false;
  fileId: number = 0;
  fileName: string = "";

  constructor(private ngZone: NgZone,
    private fileService: FileService,
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    window.onresize = (e) => {
      this.ngZone.run(() => {
        this.innerHeight = window.innerHeight + 'px';
      });
    };
    this.getScreenHeight();
  }
  public file_path: any = "";
  public isFlag = true;
  ngOnInit() {
    let url = "";
    url = this.route.snapshot.queryParams.file_path;
    this.getFilePdf(url, null);
    
  }
  onResize(event) {
    this.innerHeight = event.target.innerHeight + 'px';
  }

  afterLoadComplete() {
  }

  downloadImageService(filePath: string, cb: any) {
    this.fileService.getFile(Number(filePath)).subscribe(res => {
      cb(res.data);
    });
  }
  public base64;
  getFilePdf(path: string, cb: any) {
    if (path) {
      this.downloadImageService(path, (binary) => {
        const fileName = binary.display_name;
        let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
        this.isFlag = fileName.toLocaleLowerCase().endsWith(".png") || fileName.toLocaleLowerCase().endsWith(".jpeg") || fileName.toLocaleLowerCase().endsWith(".jpg");
        const result = this.fileService.convertBase64ToBlob(binary.content, this.isFlag ? ("image/" + suff) : "application/pdf");
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          if(!this.isFlag){
            this.pdfSrc = reader.result;
          }else{
            this.imageSrc = reader.result;
          }
        }
      });
    }
  }

  getFileImage(path: string, cb: any) {
    if (path) {
      let fileNameSplit = path.split("/");
      let fileName = fileNameSplit[fileNameSplit.length - 1];
      let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
      this.downloadImageService(path, (binary) => {
        const fileName = binary.display_name;
        this.isFlag = fileName.toLocaleLowerCase().endsWith(".png") || fileName.toLocaleLowerCase().endsWith(".jpeg") || fileName.toLocaleLowerCase().endsWith(".jpg");
        const result = this.fileService.convertBase64ToBlob(binary.content, this.isFlag ? "application/pdf" : ("image/" + suff));
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          this.imageSrc = reader.result;
        }
      });
    }
  }

  downloadFilePdf(path: string, cb: any) {
    if (path) {
      this.downloadImageService(path, (binary) => {
        let fileName = binary.display_name;
        let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
        const result = this.fileService.convertBase64ToBlob(binary.content, "application/pdf");
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          FileSaver.saveAs(reader.result, fileName);
        }
      });
    }
  }

  downloadFileImage(path: string, cb: any) {
    if (path) {
      this.downloadImageService(path, (binary) => {
        let fileName = binary.display_name;
        let suff = fileName.substr(fileName.lastIndexOf(".") + 1);
        const result = this.fileService.convertBase64ToBlob(binary.content, "image/" + suff);
        let reader = new FileReader();
        reader.readAsDataURL(result);
        reader.onloadend = () => {
          FileSaver.saveAs(reader.result, fileName);
        }
      });
    }
  }

  download(){
    let url = "";
    url = this.route.snapshot.queryParams.file_path;
    this.downloadFilePdf(url, null);
  }

  downloadImage(){
    let url = "";
    url = this.route.snapshot.queryParams.file_path;
    this.downloadFileImage(url, null);
  }

}
