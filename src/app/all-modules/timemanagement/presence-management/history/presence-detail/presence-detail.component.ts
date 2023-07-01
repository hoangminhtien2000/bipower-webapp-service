import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Constant} from "../../../../../core/helper/presence/constants";
import {
    getTimeEditedString,
    getTimeLine,
    getTimeCreatedString,
} from "../../../../../core/helper/presence/fullCalendar";
import {Presence} from "../../../../../core/models/presence.model";
import {hasRoles} from "../../../../../core/helper/role";
import {ROLE_LIST} from "../../../../../core/common/constant";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'app-presence-detail',
    templateUrl: './presence-detail.component.html',
    styleUrls: ['./presence-detail.component.scss']
})
export class PresenceDetailComponent implements OnInit {
    presences;
    isCollapsed = {};
    timeline: Array<Presence>;
    constructor(public modalRef: BsModalRef,
                private translate: TranslateService) {
    }

    ngOnInit(): void {
        this.timeline = getTimeLine(this.presences);
        this.timeline.forEach(e => {
            this.isCollapsed[e.workTimeId] = false;
        })
    }

    clickCollapsed(id) {
        this.isCollapsed[id] = !this.isCollapsed[id]
    }

    renderTimeCheckinCheckout(timeline) {
        if (timeline.status != undefined && timeline.status != Constant.PRESENCE_STATUS.APPROVED) {
            return getTimeCreatedString(timeline);
        }
        if (!timeline.checkinTimeEdit && !timeline.checkoutTimeEdit) {
            return getTimeCreatedString(timeline);
        }
        return getTimeEditedString(timeline);
    }

    renderClassByWorkType(workType) {
        switch (workType) {
            case Constant.ATTENDANCE : return "attendance"
            case Constant.REMOTE : return "remote"
            case Constant.ONSITE : return "onsite"
            case Constant.LEAVE : return "leave"
            case Constant.OVERTIME : return "ot"
        }
    }

    renderNameByWorkType(workType) {
        switch (workType) {
            case Constant.ATTENDANCE :  return this.translate.instant("timeManager.summary.in_the_office");
            case Constant.REMOTE :  return this.translate.instant("timeManager.summary.remote");
            case Constant.ONSITE : return this.translate.instant("timeManager.summary.onsite");
            case Constant.LEAVE : return this.translate.instant("timeManager.summary.off");
            case Constant.OVERTIME : return this.translate.instant("timeManager.summary.overtime");
        }
    }

    renderNameByStatus(status) {
        if (status != undefined) {
            switch (status) {
                case Constant.PRESENCE_STATUS.REJECTED : return this.translate.instant("timeManager.PRESENCE_STATUS.REJECTED");
                case Constant.PRESENCE_STATUS.PENDING : return this.translate.instant("timeManager.PRESENCE_STATUS.PENDING");
                case Constant.PRESENCE_STATUS.APPROVED :  return this.translate.instant("timeManager.PRESENCE_STATUS.APPROVED");
                case Constant.PRESENCE_STATUS.SENT_REQUEST :  return this.translate.instant("timeManager.PRESENCE_SENT_REQUEST");
                case Constant.PRESENCE_STATUS.LEADER_APPROVED : return this.translate.instant("timeManager.PRESENCE_LEADER_APPROVED");
                case Constant.PRESENCE_STATUS.WAITING_CANCEL_REQ_APPROVED : return this.translate.instant("timeManager.PRESENCE_WAITING_CANCEL_REQ_APPROVED");
            }
        }
    }

    renderClassByStatus(status) {
        if (status != undefined) {
            switch (status) {
                case Constant.PRESENCE_STATUS.REJECTED : return 'rejected'
                case Constant.PRESENCE_STATUS.PENDING : return 'approved'
                case Constant.PRESENCE_STATUS.APPROVED : return 'approved'
                case Constant.PRESENCE_STATUS.SENT_REQUEST : return 'waiting_approval'
                case Constant.PRESENCE_STATUS.WAITING_CANCEL_REQ_APPROVED : return 'waiting_approval'
                case Constant.PRESENCE_STATUS.LEADER_APPROVED : return 'waiting_approval'
            }
        }
    }

    canShowTimeEdited(timeline) {
        return timeline.workType == Constant.ATTENDANCE && timeline.checkinTimeEdit && timeline.checkoutTimeEdit;
    }

    renderTimeEdited(timeline) {
        return getTimeEditedString(timeline);
    }

    canShowHrefLink(timeline) {
        if (timeline.workType == Constant.ATTENDANCE) {
            return (hasRoles(ROLE_LIST.C_B) || hasRoles(ROLE_LIST.PRODUCT_OWNER) || hasRoles(ROLE_LIST.TEAM_LEADER)) &&
                (timeline.checkinTimeEdit && timeline.checkoutTimeEdit);
        } else {
            return true;
        }
    }

    canShowStatus(timeline) {
        if (timeline.workType == Constant.ATTENDANCE) {
            return !!(timeline.checkinTimeEdit && timeline.checkoutTimeEdit);
        } else {
            return true;
        }
    }

    renderReasonTitle(workType) {
        switch (workType) {
            case Constant.ATTENDANCE : 
            return this.translate.instant("timeManager.list_checkin_checkout.adjustment_reason");
            case Constant.LEAVE : 
            return this.translate.instant("timeManager.list_checkin_checkout.reason_for_day_off");
            case  Constant.OVERTIME : 
            return this.translate.instant("timeManager.reason_work_overtime")
            case Constant.ONSITE : 
            return this.translate.instant("timeManager.list_checkin_checkout.reason_for_work_onsite");
            case Constant.REMOTE : 
            return this.translate.instant("timeManager.list_checkin_checkout.reason_for_work_remote");
        }
    }

    renderHrefLinkByWorkType(workType, workTimeId, date) {
        switch (workType) {
            case Constant.ATTENDANCE : return `/layout/timemanagement/presencemanagement?id=${workTimeId}&workType=${workType}&date=${date}`
            case Constant.LEAVE : return `/layout/timemanagement/presencemanagement?id=${workTimeId}&workType=${workType}&date=${date}`
            case  Constant.OVERTIME : return `/layout/timemanagement/presencemanagement?id=${workTimeId}&workType=${workType}&date=${date}`
            case Constant.ONSITE : return `/layout/timemanagement/presencemanagement?id=${workTimeId}&workType=${workType}&date=${date}`
            case Constant.REMOTE : return `/layout/timemanagement/presencemanagement?id=${workTimeId}&workType=${workType}&date=${date}`
        }
    }

    canShowConfirmedBy(timeline) {
        if (timeline.status == Constant.PENDING ||
            timeline.status == Constant.SENT_REQUEST) {
            return false;
        } else {
            return !!timeline.confirmedBy;
        }
    }

    closeModal() {
        this.modalRef.hide();
    }
}
