import {CandidateFileDetailModel} from "./candidate.file.detail.model";

export class CandidateUploadCvModel {
    full_name: string;
    phone: string;
    email: string;
    file: CandidateFileDetailModel;
    constructor() {
        this.file = new CandidateFileDetailModel();
    }
}
