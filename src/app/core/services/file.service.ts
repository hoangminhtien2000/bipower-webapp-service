import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {Observable, ReplaySubject} from 'rxjs';
import {VerifyService} from './verify.service';
import {UserStorage} from "../storage/user.storage";
import {CONFIG} from "../config/application.config";

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private router: Router, 
              private http: HttpClient,
              public verifyService: VerifyService,
              public userStorage: UserStorage,
              private toastrService: ToastrService){

  }

  getTemplate(code: string): Observable<any>{
    return this.http.post(CONFIG.API.TEMPLATE_DOWNLOAD, {code : code})
  }

  getFile(fileId: number): Observable<any>{
    // return this.http.post(CONFIG.API.FILE_DOWNLOAD, {file_id : fileId})
    const url = `${CONFIG.API.FILE_DOWNLOAD}/${fileId}`;
    return this.http.get(url);
  }

  convertBase64ToBlob(base64data: string, fileType: string) {
    const byteString = window.atob(base64data);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: fileType });
    return blob;
  }

  convertFileToBase64(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = (event) => result.next(btoa(event.target.result.toString()));
    return result;
  }
}
