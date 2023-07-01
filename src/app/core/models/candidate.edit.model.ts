import {CandidateContactModel} from "./candidate.contact.model";
import {CandidateSchoolModel} from "./candidate.school.model";
import {CandidateFileModel} from "./candidate.file.model";
import {CandidateDomainModel} from "./candidate.domain.model";
import {CandidateCertificateModel} from "./candidate.certificate.model";
import {CandidateContactHistoryModel} from "./candidate.contact.history.model";

export class CandidateEditModel {
    candidate_id: number;
    candidate_code: string;
    full_name: string;
    birth_date: string;
    phone: string;
    email: string;
    address: string;
    gender: string;
    source_id: number;
    receive_time: string;
    jd_link: string;
    apply_position_id: number;
    level_id: number;
    old_company: string;
    start_work_time: string;
    technology_id: number;
    start_technology_time: string;
    max_literacy_id: number;
    literacy_english_id: number;
    status_id: number;
    contacts: CandidateContactModel[];
    schools: CandidateSchoolModel[];
    files: CandidateFileModel[];
    domains: CandidateDomainModel[];
    certificates: CandidateCertificateModel[];
    contact_histories: CandidateContactHistoryModel[];
    nationality: string;
    constructor() {
    }
}
