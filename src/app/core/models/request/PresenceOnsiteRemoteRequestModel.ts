import * as moment from "moment/moment";
import {Constant} from "../../helper/presence/constants";

export const initOnsiteRemote = () => {
    let currentDate = new Date();
    let startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 8, 0, 0);
    let endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 17, 30, 0);
    return {
        id: null,
        fromTime: moment(startDate).format(Constant.DATE_TIME_FORMAT),
        toTime: moment(endDate).format(Constant.DATE_TIME_FORMAT),
        workType: "DEFAULT",
        reason: null,
        workingLocation: "",
        projectName: "",
        sendApproveReq: true,
        timeRegister: {
            startDate: moment(startDate).format(Constant.DATE_TIME_FORMAT),
            endDate: moment(endDate).format(Constant.DATE_TIME_FORMAT),
        },
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

export const createOrUpdateOnsiteRemoteRequestModel = (onsiteRemote) => {
    return {
        id: onsiteRemote.id,
        fromTime: onsiteRemote.fromTime,
        toTime: onsiteRemote.toTime,
        workType: onsiteRemote.workType,
        reason: onsiteRemote.reason,
        workingLocation: onsiteRemote.workingLocation,
        projectName: onsiteRemote.projectName,
        sendApproveReq: onsiteRemote.sendApproveReq
    }
}

export const updateOnsiteRemoteRequestModel = (fromTime, toTime, workType, reason, workingLocation, projectName, sendApproveReq) => {
    return {
        fromTime: "28/07/2022 08:10",
        toTime: "28/07/2022 17:24",
        workType: "ONSITE",
        reason: null,
        workingLocation: "Viettel",
        projectName: "Hành tinh số",
        sendApproveReq: true
    }
}

export const approvedListOnsiteRemoteRequestModel = (attendanceIds) => {
    return {
        attendanceIds: [
            18,
            19
        ]
    }
}

export const confirmListOnsiteRemoteRequestModel = (isApproved, note, attendanceIds) => {
    return {
        isApproved: true,
        note: "Hug",
        attendanceIds: [
            18,
            19
        ]
    }
}

export const searchOnsiteRemoteRequestModel = (fromDate, toDate) => {
    return {
        teamId: null,
        isPersonal:true,
        fullname: '',
        employeeCode: '',
        fromDate: "02/08/2022",
        toDate: "17/08/2022",
        status: null,
        workType: null,
        page: 0,
        size: 10,
        sort: ['ASC']
    }
}

export const getApprovalRequestModel = (attendanceIds) => {
    return {
        isApproved: true,
        note: '',
        attendanceIds: attendanceIds
    }
}

export const refuseApprovalRequestModel = (attendanceIds, note) => {
    return {
        isApproved: false,
        note: note,
        attendanceIds: attendanceIds
    }
}

export const getUnSubscribeRequestModel = (attendanceIds, note) => {
    return {
        note: note,
        attendanceIds: attendanceIds
    }
}

export const getSendApprovalRequestModel = (attendanceIds) => {
    return {
        attendanceIds: attendanceIds
    }
}


