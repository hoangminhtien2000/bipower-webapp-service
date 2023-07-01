export class Constant {
    static START_MORNING_WORK = {
        hours: 8, minutes: 0, fullFormat: '08:00:00'
    }
    static END_MORNING_WORK = {
        hours: 12, minutes: 0, fullFormat: '12:00:00'
    }
    static START_AFTERNOON_WORK = {
        hours: 13, minutes: 30, fullFormat: '13:30:00'
    }
    static END_AFTERNOON_WORK = {
        hours: 17, minutes: 30, fullFormat: '17:30:00'
    }

    static START_LUNCH = {
        hours: 12, minutes: 0
    }

    static END_LUNCH = {
        hours: 13, minutes: 30
    }

    static LUNCH_TIME = {
        start: '12:00:00', end: '13:30:00'
    }

    static PH_ADDRESS_MAX_LENGTH = 500;
    static PRESENCE_REASON_MAX_LENGTH = 500;
    static PH_PROJECT_MAX_LENGTH = 500;
    static TIME_OF_HALF_WORKING_DAY = 4;
    static TIME_OF_WORKING_DAY = 8;
    static IS_SATURDAY = 6;
    static IS_SUNDAY = 0;
    static IS_LEAVE_SHORT = 1;
    static IS_NO_LEAVE = 0;
    static INIT_TIME_REMAINING = 0;

    static APPROVAL = 'APPROVAL';
    static APPROVED = 'APPROVED';
    static SEND_APPROVAL = 'SEND_APPROVAL';
    static NO_APPROVAL = 'NO_APPROVAL';
    static PENDING = 'PENDING';
    static SENT_REQUEST = 'SENT_REQUEST';
    static LEADER_APPROVED = 'LEADER_APPROVED';
    static REJECTED = 'REJECTED';
    static WAITING_CONFIRM_UNSUBSCRIBE = 'WAITING_CONFIRM_UNSUBSCRIBE';
    static WAITING_CANCEL_REQ_APPROVED = 'WAITING_CANCEL_REQ_APPROVED';
    static REJECTED_CONFIRM_UNSUBSCRIBE = 'REJECTED_CONFIRM_UNSUBSCRIBE';
    static UNSUBSCRIBED = 'UNSUBSCRIBED';
    static CANCEL_REQUEST_APPROVED = 'CANCEL_REQUEST_APPROVED';
    static CANCEL_REQUEST_REJECTED = 'CANCEL_REQUEST_REJECTED';

    static SAVE = 'SAVE';
    static SAVE_AND_SEND = 'SAVE_AND_SEND';

    static DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm';
    static DATE_FORMAT = 'DD/MM/YYYY';
    static TIME_FORMAT = 'HH:mm';

    // leaveType
    static UNPAID_LEAVE = 'UNPAID_LEAVE';
    static UNPAID_LEAVE_REMAINING = 0;
    static OTHER_LEAVE = 'OTHER_LEAVE';
    static OTHER_LEAVE_REMAINING = 0;
    static WEDDING_LEAVE = 'WEDDING_LEAVE';
    static WEDDING_LEAVE_REMAINING = 3;
    static CHILD_WEDDING_LEAVE = 'CHILD_WEDDING_LEAVE';
    static CHILD_WEDDING_LEAVE_REMAINING = 1;
    static FUNERAL_LEAVE = 'FUNERAL_LEAVE';
    static FUNERAL_LEAVE_REMAINING = 3;
    static ANNUAL_LEAVE = 'ANNUAL_LEAVE';
    static ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR = 'ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR';
    static COMPENSATORY_LEAVE = 'COMPENSATORY_LEAVE';

    static ATTENDANCE = "ATTENDANCE";
    static REMOTE = "REMOTE";
    static ONSITE = "ONSITE";
    static OVERTIME = "OVERTIME";
    static LEAVE = "LEAVE";
    static CALENDAR_OPTION = {
        SHOW_ALL_PRESENCE: 0
    }
    static PRESENCE_STATUS = {
        PENDING: 'PENDING',
        APPROVED: 'APPROVED',
        SENT_REQUEST: 'SENT_REQUEST',
        LEADER_APPROVED: 'LEADER_APPROVED',
        REJECTED: 'REJECTED',
        WAITING_CANCEL_REQ_APPROVED: 'WAITING_CANCEL_REQ_APPROVED'
    };

    static PRESENCE_STATUS_ARRAY = [
        {
            statusCode: "PENDING", statusName: "workingOnleave.searchform.create",
             class: "presence-status-pending"
        },
        {
            statusCode: "APPROVED", statusName:  "workingOnleave.searchform.approved", 
            class: "presence-status-approved"
        },
        {
            statusCode: "SENT_REQUEST", statusName: "workingOnleave.searchform.submitRequestApprove", 
            class: "presence-status-send-request"
        },
        {
            statusCode: "LEADER_APPROVED", statusName: "workingOnleave.searchform.leaderApprove",
            class: "presence-status-leader-approved"
        },
        {
            statusCode: "REJECTED", statusName: "workingOnleave.searchform.rejectApproved", 
            class: "presence-status-rejected"
        }
    ]

    static NEVER_CHECKOUT_TODAY = 0;
}
