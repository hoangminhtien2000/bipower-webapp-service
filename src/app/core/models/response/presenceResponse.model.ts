import {Presence} from "../presence.model";

export class HistoryResponse {
    success: boolean;
    data: {workingTimeDetails: Array<Presence>, countEachWorkType: any};
    message: string;
}

export class UpdatePresenceResponse {
    success: boolean;
    data: Presence;
    message: string;
}

export class GetPresenceResponse {
    success: boolean;
    data: Presence;
    message: string;
}

export class SearchPresencesResponse {
    success: boolean;
    data: {
        content: Array<SearchPresencesContent>;
    };
    message: string;
}

export class SearchPresencesContent {
    id: number;
    teamName: string;
    fullname: string;
    employeeCode: string;
    reason: string;
    status?: string;
    requestChangeWorkingTimeStatus?: string;
    requestWorkOutsideStatus?: string;
    checkinTime: string;
    checkoutTime: string;
    checkinTimeEdit: string;
    checkoutTimeEdit: string;
}
