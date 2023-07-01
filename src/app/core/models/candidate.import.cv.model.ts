import {CandidateFileModel} from "./candidate.file.model";

export class CandidateImportCvModel {
    candidate_id: number;
    files: CandidateFileModel[];

    constructor() {
        this.files = [];
    }
}
