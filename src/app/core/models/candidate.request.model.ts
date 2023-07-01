import {GenderModel} from "./gender.model";

export class CandidateRequestModel {
    candidate_id: number;
    candidate_code: string;
    full_name: string;
    birth_date: string;
    phone: string;
    email: string;
    address: string;
    gender: GenderModel;
    source_id: number;
    receive_time: Date;
    jd_link: string;
    apply_position_id: number;
    apply_position_name: string;
    level_id: number;
    old_company: string;
    start_work_time: Date;
    technology_id: number;
    technology_name: string;
    start_technology_time: Date;
    max_literacy_id: number;
    literacy_english_id: number;
    in_charge_user_id: number;
    status_id: number;
    status_name: string;
    create_user_id: number;
    last_update_user_id: number;
    hr: string;
    create_date: Date;
    from_time: string;
    to_time: string;
    checked: boolean = false;
    from_estimate_onboard_date: string;
    to_estimate_onboard_date: string;
}
