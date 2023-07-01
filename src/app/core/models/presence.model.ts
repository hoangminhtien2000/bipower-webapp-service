export class Presence {
    workTimeId?: number;
    start: Date;
    checkinTime?: string;
    checkoutTime?: string;
    workType?: string;
    checkinTimeEdit?: string;
    checkoutTimeEdit?: string;
    reason?: string;
    workingLocation?: string;
    projectName?: string;
    status?: string;
    requestChangeWorkingTimeStatus?: string;
    requestWorkOutsideStatus?: string;
    confirmedBy?: string;
    rejectedReason?: string;
    requestCode?: string;
}

export class summarySearchResponse {
    data: {};
    message: string;
    success: boolean;
}
