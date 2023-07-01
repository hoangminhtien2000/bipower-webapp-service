import {Constant} from "../../helper/leave/constants";
import * as moment from "moment/moment";

export const leaveUpdateRequestModel = (time, leaveType, reason, action) => {
    let leaveFromAt = typeof time.startDate == 'string' ? time.startDate : moment(time.startDate).format('DD/MM/YYYY HH:mm')
    let leaveToAt = typeof time.endDate == 'string' ? time.endDate : moment(time.endDate).format('DD/MM/YYYY HH:mm')
    return {
        leaveFromAt: leaveFromAt,
        leaveToAt: leaveToAt,
        leaveType: leaveType,
        reason: reason.trim(),
        sendApproveReq: action != Constant.SAVE
    }
}

export const getApprovalRequestModel = (leaveIds) => {
    return {
        isApproved: true,
        note: '',
        employeeLeaveIds: leaveIds
    }
}

export const refuseApprovalRequestModel = (leaveIds, note) => {
    return {
        isApproved: false,
        note: note,
        employeeLeaveIds: leaveIds
    }
}

export const getUnSubscribeRequestModel = (leaveIds, note) => {
    return {
        note: note,
        employeeLeaveIds: leaveIds
    }
}

export const getSendApprovalRequestModel = (leaveIds) => {
    return {
        employeeLeaveIds: leaveIds
    }
}

export const initLeave = () => {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), currentDate.getHours(), currentDate.getMinutes(), 0);
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 30, 0);
    return {
        leaveType: 'ANNUAL_LEAVE',
        leaveHour: 8,
        reason: "",
        leaveTime: {
            startDate: moment(startDate).format(Constant.DATE_TIME_FORMAT),
            endDate: moment(endDate).format(Constant.DATE_TIME_FORMAT),
        },
        sendApproveReq: true,
        leaveFromAt: moment(getRoundedDate(5,startDate)).format(Constant.DATE_TIME_FORMAT),
        leaveToAt: moment(getRoundedDate(5,endDate)).format(Constant.DATE_TIME_FORMAT),
        employeeId: "",
    };
}

const getRoundedDate = (minutes, d=new Date()) => {
    let ms = 1000 * 60 * minutes; // convert minutes to ms
    let roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
    return roundedDate
}

export const newLeaveRequestModel = (leave) => {
    return {
        employeeId: leave.employeeId,
        leaveType: leave.leaveType,
        reason: leave.reason ? leave.reason.trim() : "",
        sendApproveReq: leave.sendApproveReq,
        leaveFromAt: leave.leaveFromAt ? leave.leaveFromAt : moment().format("DD/MM/YYYY 08:00"),
        leaveToAt: leave.leaveToAt ? leave.leaveToAt : moment().format("DD/MM/YYYY 17:30"),
    };
}

export const searchLeaveRequestModel = (leaveFromAt, leaveToAt) => {
    return {
        page: 0,
        size: 10,
        employeeCode: '',
        employeeName: '',
        leaveType: null,
        leaveStatus: null,
        leaveFromAt: leaveFromAt,
        leaveToAt: leaveToAt,
    }
}

export const searchWorkingLeaveReportModel = (year = null, month = null, fullname = null) => {
    return {
        year: year,
        month: month,
        fullname: fullname,
    }
}



