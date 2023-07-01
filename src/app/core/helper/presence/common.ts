import * as moment from "moment";
import {Constant} from "./constants";

export const getDateTimeString = (startDate, endDate, format = "DD/MM/YYYY HH:mm - HH:mm") => {
    let date = startDate ? moment(startDate, Constant.DATE_FORMAT).format(Constant.DATE_FORMAT) : "";
    let fromTime = startDate ? getTimeString(startDate) : "--:--"
    let toTime = endDate ? getTimeString(endDate) : "--:--"
    return date + " " + fromTime + " - " + toTime;
}

export const getTimeString = (dateTime, format = "HH:mm") => {
    let hours = moment(dateTime, 'DD/MM/YYYY HH:mm').hours() < 10 ?
        "0" + moment(dateTime, 'DD/MM/YYYY HH:mm').hours().toString() :
        moment(dateTime, 'DD/MM/YYYY HH:mm').hours().toString();
    let minutes = moment(dateTime, 'DD/MM/YYYY HH:mm').minutes() < 10 ?
        "0" + moment(dateTime, 'DD/MM/YYYY HH:mm').minutes().toString() :
        moment(dateTime, 'DD/MM/YYYY HH:mm').minutes().toString();
    return hours + ":" + minutes;
}

export const setStatusOfPresences = (presences) => {
    if (presences.length > 0) {
        presences.forEach(presence => {
            if (presence.workType == Constant.ATTENDANCE && presence.requestChangeWorkingTimeStatus !== undefined) {
                presence.status = presence.requestChangeWorkingTimeStatus;
            }
            if (presence.workType != Constant.ATTENDANCE && presence.requestWorkOutsideStatus !== undefined) {
                presence.status = presence.requestWorkOutsideStatus;
            }
        })
    }
    return presences;
}

export const setStatusOfPresence = (presence) => {
    if (presence.workType == Constant.ATTENDANCE && presence.requestChangeWorkingTimeStatus !== undefined) {
        presence.status = presence.requestChangeWorkingTimeStatus;
    }
    if (presence.workType != Constant.ATTENDANCE && presence.requestWorkOutsideStatus !== undefined) {
        presence.status = presence.requestWorkOutsideStatus;
    }
    return presence;
}

export const sortByEmployeeCode = (array) => {
    if (array.length > 0) {
        array.sort(function(a, b){
            var codeA = a.employeeCode.toLowerCase(), codeB = b.employeeCode.toLowerCase();
            if (codeA < codeB)
                return -1;
            if (codeA > codeB)
                return 1;
        });
    }
    return array;
}


export const sortByEmployeeName = (array) => {
    if (array.length > 0) {
        array.sort(function(a, b){
            var nameA = a.firstName.toLowerCase(), nameB = b.firstName.toLowerCase();
            if (nameA < nameB)
                return -1;
            if (nameA > nameB)
                return 1;
        });
    }
    return array;
}
