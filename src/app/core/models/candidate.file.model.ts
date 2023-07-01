import {CandidateFileDetailModel} from "./candidate.file.detail.model";

export class CandidateFileModel {
    create_time: Date;
    last_update_time: Date;
    candidate_file_id: number;
    candidate_id: number;
    file_id: number;
    deleted: number;
    file: CandidateFileDetailModel;
}
