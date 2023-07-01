import * as moment from "moment/moment";
import {Constant} from "../../helper/presence/constants";

export const historyRequestModel = (time, employeeId) => {
    let month = time.month() + 1;
    month = month < 10 ? "0" + month : month
    return {
        historyInMonth: "01/" + month + "/" + time.year(),
        employeeId: employeeId
    }
}

export const summarySearchRequestModel = (fromDate, toDate) => {
    return {
        startDate: fromDate,
        endDate: toDate,
    }
}

export const updatePresenceRequestModel = (workTimeId, start, fromTime, toTime, reason, sendApproveReq) => {
    let day = new Date(start).getDate() < 10 ? "0" + new Date(start).getDate() : new Date(start).getDate();
    let month = new Date(start).getMonth() + 1 < 10 ? "0" + (new Date(start).getMonth() + 1) : new Date(start).getMonth() + 1;
    let year = new Date(start).getFullYear();
    let date = day + '/' + month + '/' + year;
    return {
        attendanceId: workTimeId,
        checkinTimeEdit: date.toString() + " " + fromTime,
        checkoutTimeEdit: date.toString() + " " + toTime,
        reason: reason,
        sendApproveReq: sendApproveReq
    }
}

export const addPresenceRequestModel = (start, fromTime, toTime, reason, sendApproveReq) => {
    let day = new Date(start).getDate() < 10 ? "0" + new Date(start).getDate() : new Date(start).getDate();
    let month = new Date(start).getMonth() + 1 < 10 ? "0" + (new Date(start).getMonth() + 1) : new Date(start).getMonth() + 1;
    let year = new Date(start).getFullYear();
    let date = day + '/' + month + '/' + year;
    return {
        checkinTimeEdit: date.toString() + " " + fromTime,
        checkoutTimeEdit: date.toString() + " " + toTime,
        reason: reason,
        sendApproveReq: sendApproveReq
    }
}

export const initOnsiteRemote = () => {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0);
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 30, 0);
    return {
        workingType: 1,
        address: "",
        project: "",
        timeRegister: {
            startDate: moment(startDate).format(Constant.DATE_TIME_FORMAT),
            endDate: moment(endDate).format(Constant.DATE_TIME_FORMAT),
        },
        sendApproveReq: true,
        onsiteRemoteFromAt: "",
        onsiteRemoteToAt: "",
    };
}

export const newOnsiteRemoteRequestModel = (onsiteRemote) => {
    return {
        workingType: onsiteRemote.workingType,
        address: onsiteRemote.address ? onsiteRemote.address.trim() : "",
        project: onsiteRemote.project ? onsiteRemote.project.trim() : "",
        sendApproveReq: onsiteRemote.sendApproveReq,
        onsiteRemoteFromAt: onsiteRemote.onsiteRemoteFromAt ? onsiteRemote.onsiteRemoteFromAt : moment().format("DD/MM/YYYY"),
        onsiteRemoteToAt: onsiteRemote.onsiteRemoteFromAt ? onsiteRemote.onsiteRemoteFromAt : moment().format("DD/MM/YYYY"),
    };
}

export const searchPresenceRequestModel = (teamId, fullname, employeeCode, fromDate, toDate, status) => {
    return {
        teamId: teamId == 'null' ? null : teamId,
        fullname: fullname,
        employeeCode: employeeCode,
        fromDate: fromDate,
        toDate: toDate,
        status: status == 'null' ? null : status,
    };
}

export const searchPresenceParamsRequestModel = (page, size) => {
    return {
        page: page - 1,
        size: size,
    };
}

export const approvalPresencesRequestModel = (attendanceIds) => {
    return {
        attendanceIds: attendanceIds,
        isApproved: true,
        note: null,
    };
}

export const rejectPresencesRequestModel = (attendanceIds, note) => {
    return {
        attendanceIds: attendanceIds,
        isApproved: false,
        note: note,
    };
}
