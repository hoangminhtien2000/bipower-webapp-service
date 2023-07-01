import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {Observable} from 'rxjs';
import {VerifyService} from './verify.service';
import {UserStorage} from "../storage/user.storage";
import {CONFIG} from "../config/application.config";
import {CandidateSearchModel} from "../models/candidate.search.model";
import {CandidateAddModel} from "../models/candidate.add.model";
import {CandidateAssignModel} from "../models/candidate.assign.model";
import {CANDIDATE} from "../common/constant";
import {CandidateUploadCvModel} from "../models/candidate.upload.cv.model";
import {CandidateFileDetailModel} from "../models/candidate.file.detail.model";
import {CandidateImportCvModel} from "../models/candidate.import.cv.model";
import {CandidateEditModel} from "../models/candidate.edit.model";

@Injectable({
    providedIn: 'root'
})
export class CandidateService {

    constructor(private router: Router,
        private http: HttpClient,
        public verifyService: VerifyService,
        public userStorage: UserStorage,
        private toastrService: ToastrService) {

    }

    add(model: CandidateAddModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_ADD, model);
    }

    edit(model: CandidateEditModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_EDIT, model);
    }

    assign(model: CandidateAssignModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_ASSIGN, model);
    }

    search(model: CandidateSearchModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_SEARCH, model);
    }
    export(model: CandidateSearchModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_EXPORT, model);
    }

    detailByCandidateId(candidateId: string): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_DETAIL, {candidate_id: candidateId});
    }

    getCV(candidateId: number): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_GET_CV, {candidate_id: candidateId});
    }

    uploadCV(uploadcv: CandidateUploadCvModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_UPLOAD_CV, uploadcv);
    }

    importCV(importcvs: CandidateImportCvModel[]): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_IMPORT_CV, {candidates: importcvs});
    }

    import(file: CandidateFileDetailModel): Observable<any> {
        return this.http.post<any>(CONFIG.API.CANDIDATE_IMPORT, {file: file});
    }

    changeCandidateIdByDetail(candidateId: number){
        localStorage.setItem(CANDIDATE.MODEL.CANDIDATE_ID, candidateId.toString());
    }

    getCandidateDetailId() {
        let candidateId = localStorage.getItem(CANDIDATE.MODEL.CANDIDATE_ID);
        return candidateId;
    }

    clearCandidateIdByDetail(){
        localStorage.removeItem(CANDIDATE.MODEL.CANDIDATE_ID);
    }
}
