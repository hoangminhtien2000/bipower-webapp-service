import * as moment from "moment/moment";
import {Constant} from "./constants";

export const customDays = (day, trans) => {
    switch (day) {
        case "Mon" :
            return trans ? trans.instant("timeManager.weekday.MONDAY") : "";
        case "Tue" :
            return trans ? trans.instant("timeManager.weekday.TUESDAY") : "";
        case "Wed" :
            return trans ? trans.instant("timeManager.weekday.WEDNESDAY") : "";
        case "Thu" :
            return trans ? trans.instant("timeManager.weekday.THURSDAY") : "";
        case "Fri" :
            return trans ? trans.instant("timeManager.weekday.FRIDAY") : "";
        case "Sat" :
            return trans ? trans.instant("timeManager.weekday.SATURDAY") : "";
        case "Sun" :
            return trans ? trans.instant("timeManager.weekday.SUNDAY") : "";
    }
}

export const customEventContent = (data, trans) => {
    let event = data._def.extendedProps;
    let start = data.start;
    let register_change = trans ? trans.instant("timeManager.summary.register_change") : "";
    if (isAddPresenceEvent(event) && !isToday(start) && !isAfterDay(start)) {
        return {html: "<button class='btn btn-add-presence pl-1px pr-1px'><i class='fa fa-plus'></i>" + register_change + "</button>"};
    } else {
        let time = getTimeString(event);
        switch (event.workType) {
            case Constant.ATTENDANCE :
                if (event.status == Constant.PRESENCE_STATUS.APPROVED || event.status == Constant.PRESENCE_STATUS.REJECTED || event.status == undefined || event.status == Constant.PRESENCE_STATUS.PENDING) {
                    return {html: "<div class='presence'><div style='text-align: left'><i class='presence-status-attendance fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</span></div>"};
                } else {
                    return {html: "<div class='presence cursor-not-allowed'><div style='text-align: left'><i class='presence-status-attendance fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</span></div>"};
                }
            case Constant.ONSITE :
                return {html: "<div class='presence cursor-not-allowed'><div style='text-align: left'><i class='presence-status-onsite fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</div>"};
            case Constant.REMOTE :
                return {html: "<div class='presence cursor-not-allowed'><div style='text-align: left'><i class='presence-status-remote fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</div>"};
            case Constant.OVERTIME :
                return {html: "<div class='presence cursor-not-allowed'><div style='text-align: left'><i class='presence-status-ot fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</div>"};
            case Constant.LEAVE :
                return {html: "<div class='presence cursor-not-allowed'><div style='text-align: left'><i class='presence-status-leave fa fa-square'></i><span class='presence-time p-1'>" + time + "</span></div>" + renderStatusIcon(event.status) + "</div>"};
            default:
                return "";
        }
    }
}

const isAddPresenceEvent = (event) => {
    return event.checkinTime == undefined && event.checkoutTime == undefined;
}

export const getTimeString = (event) => {
    let from = "--:--";
    let to = "--:--";
    if (event.checkinTime != undefined) {
        from = event.checkinTime;
    }
    if (event.checkoutTime != undefined) {
        to = event.checkoutTime;
    }
    if (event.checkinTimeEdit !== undefined && event.status != undefined && event.status != Constant.PRESENCE_STATUS.PENDING) {
        from = event.checkinTimeEdit;
    }
    if (event.checkoutTimeEdit !== undefined && event.status != undefined && event.status != Constant.PRESENCE_STATUS.PENDING) {
        to = event.checkoutTimeEdit;
    }
    return from + " - " + to;
}

export const getTimeEditedString = (event) => {
    let from = "--:--";
    let to = "--:--";
    if (event.checkinTimeEdit !== undefined) {
        from = event.checkinTimeEdit;
    }
    if (event.checkoutTimeEdit !== undefined) {
        to = event.checkoutTimeEdit;
    }
    return from + " - " + to;
}

export const getTimeCreatedString = (event) => {
    let from = "--:--";
    let to = "--:--";
    if (event.checkinTime != undefined) {
        from = event.checkinTime;
    }
    if (event.checkoutTime != undefined) {
        to = event.checkoutTime;
    }
    return from + " - " + to;
}

const renderStatusIcon = (status) => {
    if (status != undefined) {
        switch (status) {
            case Constant.PRESENCE_STATUS.APPROVED :
                return "<div class='presence-status-icon' style='text-align: right'><img src='../../../../assets/img/icons/approval.png'></div>"
            case Constant.PRESENCE_STATUS.SENT_REQUEST :
                return "<div class='presence-status-icon' style='text-align: right'><img src='../../../../assets/img/icons/waiting-approval.png'></div>"
            case Constant.PRESENCE_STATUS.LEADER_APPROVED :
                return "<div class='presence-status-icon' style='text-align: right'><img src='../../../../assets/img/icons/waiting-approval.png'></div>"
            case Constant.PRESENCE_STATUS.REJECTED :
                return "<div class='presence-status-icon' style='text-align: right'><img src='../../../../assets/img/icons/rejected.png'></div>"
            case Constant.PRESENCE_STATUS.WAITING_CANCEL_REQ_APPROVED :
                return "<div class='presence-status-icon' style='text-align: right'><img src='../../../../assets/img/icons/waiting-approval.png'></div>"
            default:
                return "";
        }
    }
    return '';
}

export const customHeaderToolbar = () => {
    return {
        left: '',
        center: '',
        right: ''
    }
}

export const nextMonth = (timeCurrent) => {
    return timeCurrent.month(timeCurrent.month() + 1)
}

export const previousMonth = (timeCurrent) => {
    return timeCurrent.month(timeCurrent.month() - 1)
}

export const getTime = (time) => {
    let month = time.month() + 1;
    return {month: month, year: time.year()}
}

export const currentTime = () => {
    return moment();
}

export const addPresenceDetailLink = (trans) => {
    let details = trans ? trans.instant("timeManager.list_checkin_checkout.details") : "";
    return { html: "<a>" + details + "</a>" };
}

export const hidePresenceDetailLink = (e) => {
    e.el.title = '';
    Array.from(e.el.parentElement.parentElement.children[0].children[0].children[0].children[0].classList).forEach(element => {
        if (element === "btn-add-presence") {
            e.el.style.display = "none";
        }
    })
}

export const getTimeLine = (presences) => {
    let timeline = [];
    if (presences.length > 0) {
        presences.forEach(presence => {
            if (presence.event._def.extendedProps.workTimeId != undefined) {
                let newPresence = JSON.parse(JSON.stringify(presence.event._def.extendedProps));
                newPresence.start = moment(presence.start, 'DD/MM/YYYY').format('DD/MM/YYYY');
                Object.preventExtensions(newPresence);
                timeline.push(newPresence)
            }
        })
        timeline = sortAscTimeline(timeline)
    }
    return timeline;
}

const sortAscTimeline = (timeline) => {
    if (timeline.length > 1) {
        timeline = timeline.sort(function (a, b) {
            return Number(a.checkinTime.slice(0, 2)) - Number(b.checkinTime.slice(0, 2))
        });
    }
    return timeline;
}

export const convertEventsData = (events) => {
    if (events.length > 0) {
        let notHaveAttendance = true;
        let size = events.length;
        let eventsLoop = Array.of(...events);
        for (let i=0; i<size; i++) {
            let event = eventsLoop[i];
            if (i!= 0 && eventsLoop[i-1].start !== event.start && eventsLoop[i-1].workType !== undefined) {
                if (notHaveAttendance) {
                    eventsLoop.push({start: eventsLoop[i-1].start})
                }
                notHaveAttendance = true;
            }
            if (event.checkinTime !== undefined) {
                event.checkinTime = event.checkinTime.length == 5 ? event.checkinTime : convertTimeToStringFormat(event.checkinTime);
            }
            if (event.checkoutTime !== undefined) {
                event.checkoutTime = event.checkoutTime.length == 5 ? event.checkoutTime : convertTimeToStringFormat(event.checkoutTime);
            }
            if (event.checkinTimeEdit !== undefined) {
                event.checkinTimeEdit = event.checkinTimeEdit.length == 5 ? event.checkinTimeEdit : convertTimeToStringFormat(event.checkinTimeEdit);
            }
            if (event.checkoutTimeEdit !== undefined) {
                event.checkoutTimeEdit = event.checkoutTimeEdit.length == 5 ? event.checkoutTimeEdit : convertTimeToStringFormat(event.checkoutTimeEdit);
            }
            if (event.workType == Constant.ATTENDANCE) {
                notHaveAttendance = false;
                if (event.requestChangeWorkingTimeStatus !== undefined) {
                    event.status = event.requestChangeWorkingTimeStatus;
                }
            } else {
                if (event.requestWorkOutsideStatus !== undefined) {
                    event.status = event.requestWorkOutsideStatus;
                }
            }
            if (isToday(event.start)) {
                events = removeAddPresenceEventOfToday(event, events);
            }
        }
        events = addEvents(events);
    }
    return events;
}

const removeAddPresenceEventOfToday = (event, events) => {
    if (isAddPresenceEvent(event)) {
        events = events.filter(function (e) {
            return e.start != event.start
        })
    }
    return events;
}

const groupEventsByStart = (events, start) => {
    return events.reduce((result, obj) => {
        (result[obj[start]] = result[obj[start]] || []).push(obj);
        return result;
    }, {});
};

const addEvents = (events) => {
    let startsOfMonth = groupEventsByStart(events, 'start');
    let newEvents = [];
    for (const start in startsOfMonth) {
        let hasAttendanceEvent = startsOfMonth[start]
            .map(item => item.workType)
            .includes(Constant.ATTENDANCE);
        let hasLeaveEvent = startsOfMonth[start]
            .map(item => item.workType)
            .includes(Constant.LEAVE);
        let hasAddAttendanceEvent = startsOfMonth[start]
            .map(item => item.workType)
            .includes(undefined);
        if (!hasAttendanceEvent && !hasAddAttendanceEvent && !hasLeaveEvent) {
            newEvents.push({start: moment(start).format("YYYY-MM-DD")})
        }
    }
    if (newEvents.length > 0) {
        newEvents.forEach(newEvent => {
            events.push(newEvent);
        })
    }
    return events;
}

const isToday = (date) => {
    return moment(date).isSame(moment(), 'day');
}
const isAfterDay = (date) => {
    return moment(date).isAfter(moment(), 'day');
}
export const convertTimeToStringFormat = (time, format = "HH:mm") => {
    if (time != undefined && time.length > 5) {
        return time.slice(0, time.length - 3)
    }
    return "--:--";
}

export const getTimeToFormat = (time, format = "HH:mm") => {
    if (time != undefined && time.length > 5) {
        return time.slice(0, time.length - 3)
    }
    return null;
}

