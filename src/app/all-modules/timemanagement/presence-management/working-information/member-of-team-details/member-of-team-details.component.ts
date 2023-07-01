import {Component, OnInit} from '@angular/core';
import {BsModalRef} from "ngx-bootstrap/modal";
import {Constant} from "../../../../../core/helper/presence/constants";

@Component({
    selector: 'app-member-of-team-details',
    templateUrl: './member-of-team-details.component.html',
    styleUrls: ['./member-of-team-details.component.scss']
})
export class MemberOfTeamDetailsComponent implements OnInit {
    isCollapsed = {};
    value

    constructor(public modalRef: BsModalRef,) {
    }


    clickCollapsed(id) {
        this.isCollapsed[id] = !this.isCollapsed[id]
    }

    ngOnInit(): void {
    }

    renderTime = (time) => {
        if (time === undefined) {
            time = "--:--"
        }
        return time.slice(0, time.length - 3)
    }

    renderStatusName(status) {
        if (status != undefined) {
            switch (status) {
                case Constant.PRESENCE_STATUS.REJECTED :
                    return {name: "Đã từ chối phê duyệt", class: 'rejected'}
                case Constant.PRESENCE_STATUS.PENDING :
                    return {name: "Tạo mới", class: 'approved'}
                case Constant.PRESENCE_STATUS.APPROVED :
                    return {name: "Đã phê duyệt", class: 'approved'}
                case Constant.PRESENCE_STATUS.SENT_REQUEST :
                    return {name: "Đã gửi phê duyệt", class: 'waiting_approval'}
                case Constant.PRESENCE_STATUS.LEADER_APPROVED :
                    return {name: "Trưởng nhóm đã phê duyệt", class: 'waiting_approval'}
            }
        }
    }

    renderIconType(workType) {
        switch (workType) {
            case Constant.ATTENDANCE :
                return "attendance"
            case Constant.REMOTE :
                return "remote"
            case Constant.ONSITE :
                return "onsite"
            case Constant.LEAVE :
                return "leave"
            case Constant.OVERTIME :
                return "ot"
        }
    }

    renderWorkTypeName(workType) {
        switch (workType) {
            case Constant.ATTENDANCE :
                return "Làm việc tại công ty"
            case Constant.REMOTE :
                return "Làm remote"
            case Constant.ONSITE :
                return "Làm onsite"
            case Constant.LEAVE :
                return "Nghỉ"
            case Constant.OVERTIME :
                return "Làm ngoài giờ"
        }
    }

    renderLink(workType, workTimeId) {
        if (workType === Constant.LEAVE) {
            return {url: "/layout/timemanagement/onleavemanagement?id=" + workTimeId, name: "Đơn đăng ký " + workTimeId}
        }
        if (workType === Constant.OVERTIME) {
            return {
                url: "/layout/timemanagement/overtimemanagement?id=" + workTimeId,
                name: "Đơn đăng ký " + workTimeId
            }
        }
        return false;
    }

    closeModal() {
        this.modalRef.hide();
    }
}
