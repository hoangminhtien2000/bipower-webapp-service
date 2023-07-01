import {CatalogItemModel} from "./catalog.item.model";
import {UserModel} from "./user.model";

export class CandidateContactHistoryModel {
    create_time: string;
    last_update_time: string;
    candidate_contact_history_id: number;
    candidate_id: number;
    contact_id: number;
    contact_status_id: number;
    status_after_contact_id: number;
    response_id: number;
    note: string;
    candidate_status_id: number;
    contact_time: string;
    contact_user_id: number;
    contact_user: UserModel;
    deleted: boolean;
    contact: CatalogItemModel;
    contact_status: CatalogItemModel;
    status_after_contact: CatalogItemModel;
    response: CatalogItemModel;
    candidate_status: CatalogItemModel;
}
