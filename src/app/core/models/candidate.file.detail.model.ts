export class CandidateFileDetailModel {
    create_time: Date;
    last_update_time: Date;
    file_id: number;
    type: string;
    full_path: string;
    name: string;
    display_name: string;
    extension: string
    deleted: false;
    content: string;
}
