import {Constant} from "./constants";
import {holidays} from "../../../../environments/environment";
import * as moment from "moment";
import {getDate} from "./validateUpdateOnsiteRemoteForm";

export const toHours = (millisecond) => {
    return millisecond / 60 / 60 / 1000;
}

export const setTime = (startOfMorningWork, endOfMorningWork, startOfAfternoonWork, endOfAfternoonWork) => {
    startOfMorningWork.setHours(Constant.START_MORNING_WORK.hours);
    startOfMorningWork.setMinutes(Constant.START_MORNING_WORK.minutes);

    endOfMorningWork.setHours(Constant.END_MORNING_WORK.hours);
    endOfMorningWork.setMinutes(Constant.END_MORNING_WORK.minutes);

    startOfAfternoonWork.setHours(Constant.START_AFTERNOON_WORK.hours);
    startOfAfternoonWork.setMinutes(Constant.START_AFTERNOON_WORK.minutes);

    endOfAfternoonWork.setHours(Constant.END_AFTERNOON_WORK.hours);
    endOfAfternoonWork.setMinutes(Constant.END_AFTERNOON_WORK.minutes);
}

export const convertDateRangerToDateArray = (startDate, endDate) => {
    const dates = []
    let currentDate = startDate
    const addDays = function (days) {
        const date = new Date(this.valueOf())
        date.setDate(date.getDate() + days)
        return date
    }
    while (currentDate <= endDate) {
        dates.push(currentDate)
        currentDate = addDays.call(currentDate, 1)
    }

    return dates
}

export const unsetWeekends = (dates) => {
    dates = dates.filter(date => moment(date).day() !== Constant.IS_SATURDAY);
    dates = dates.filter(date => moment(date).day() !== Constant.IS_SUNDAY);
    return dates;
}

export const unsetHolidays = (dateArray) => {
    let holidayShort = holidays.holiday_short;
    dateArray = dateArray.filter(date => {
        return !holidayShort.find((holiday) => {
            return new Date(date).getTime() === new Date(holiday).getTime();
        })
    });
    return dateArray;
}

export const getLeaveHours = (startDate, endDate) => {
    let leaveHours: number;
    let datesArray = convertDateRangerToDateArray(startDate, endDate);
    datesArray = unsetWeekends(datesArray);
    datesArray = unsetHolidays(datesArray);

    if (datesArray.length == Constant.IS_NO_LEAVE) {
        leaveHours = Constant.IS_NO_LEAVE;
    } else if (datesArray.length == Constant.IS_LEAVE_SHORT) {
        leaveHours = isLeaveShort(startDate, endDate);
    } else {
        leaveHours = isLeaveLong(startDate, endDate, datesArray);
    }
    return leaveHours;
}

export const isLeaveShort = (startDate, endDate) => {
    let fromAt = new Date(startDate);
    let toAt = new Date(endDate);

    let startOfMorningWork = new Date(startDate);
    let endOfMorningWork = new Date(startDate);
    let startOfAfternoonWork = new Date(endDate);
    let endOfAfternoonWork = new Date(endDate);

    setTime(startOfMorningWork, endOfMorningWork, startOfAfternoonWork, endOfAfternoonWork);

    let leaveMorning = 0;
    let leaveAfternoon = 0;
    let numberOfWorkingDays = 0;

    if (isNoLeave(fromAt, toAt)) {
        return Constant.IS_NO_LEAVE;
    } else {
        if (dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            leaveMorning = toHours(endOfMorningWork.getTime() - fromAt.getTime());
            leaveAfternoon = toHours(toAt.getTime() - startOfAfternoonWork.getTime())
        }

        if (dateInMorningWork(fromAt) && !dateInAfternoonWork(toAt)) {
            leaveMorning = toHours(toAt.getTime() - fromAt.getTime());
            leaveAfternoon = 0;
        }

        if (!dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            leaveMorning = 0;
            leaveAfternoon = toHours(toAt.getTime() - fromAt.getTime());
        }
        return numberOfWorkingDays * Constant.TIME_OF_WORKING_DAY + leaveMorning + leaveAfternoon;
    }
}

export const isLeaveLong = (startDate, endDate, dateArray) => {
    let fromAt = new Date(startDate);
    let toAt = new Date(endDate);

    let startOfMorningWork = new Date(startDate);
    let endOfMorningWork = new Date(endDate);
    let startOfAfternoonWork = new Date(startDate);
    let endOfAfternoonWork = new Date(endDate);

    setTime(startOfMorningWork, endOfMorningWork, startOfAfternoonWork, endOfAfternoonWork);

    let noLeaveMorning = 0;
    let noLeaveAfternoon = 0;
    let numberOfWorkingDays = dateArray.length;

    if (isNoLeave(fromAt, toAt)) {
        return Constant.IS_NO_LEAVE;
    } else {
        if (dateInMorningWork(fromAt) && !dateInAfternoonWork(toAt)) {
            noLeaveMorning = toHours(fromAt.getTime() - startOfMorningWork.getTime());
            noLeaveAfternoon = Constant.TIME_OF_HALF_WORKING_DAY + toHours(endOfMorningWork.getTime() - toAt.getTime());
        }

        if (dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            noLeaveMorning = toHours(fromAt.getTime() - startOfMorningWork.getTime());
            noLeaveAfternoon = toHours(endOfAfternoonWork.getTime() - toAt.getTime());
        }

        if (!dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            noLeaveMorning = Constant.TIME_OF_HALF_WORKING_DAY + (toHours(fromAt.getTime() - startOfAfternoonWork.getTime()));
            noLeaveAfternoon = toHours(endOfAfternoonWork.getTime() - toAt.getTime());
        }
        return numberOfWorkingDays * Constant.TIME_OF_WORKING_DAY - noLeaveMorning - noLeaveAfternoon;
    }
}

export const isNoLeave = (fromAt, toAt) => {
    return startLessThanStartWorkingDay(fromAt) ||
        endBiggerThanEndWorkingDay(toAt) ||
        dateInLunchTime(fromAt) ||
        dateInLunchTime(toAt) ||
        dateIsWeekends(toAt) ||
        dateIsWeekends(fromAt) ||
        dateIsHolidays(toAt) ||
        dateIsHolidays(fromAt);
}

export function startLessThanStartWorkingDay(fromAt) {
    let start = getDate(fromAt);
    return (start.hours() < Constant.START_MORNING_WORK.hours)
        || (start.hours() === Constant.START_MORNING_WORK.hours && start.minutes() < Constant.START_MORNING_WORK.minutes);
}

export function endBiggerThanEndWorkingDay(toAt) {
    let start = getDate(toAt);
    return (start.hours() > Constant.END_AFTERNOON_WORK.hours)
        || (start.hours() === Constant.END_AFTERNOON_WORK.hours && start.minutes() > Constant.END_AFTERNOON_WORK.minutes);
}

export function dateIsWeekends(date) {
    return moment(date).day() == Constant.IS_SUNDAY || moment(date).day() == Constant.IS_SATURDAY;
}

export function dateIsHolidays(date) {
    let holidayShort = holidays.holiday_short;
    return !!holidayShort.find(element => moment(element).format('DD/MM/YYYY') === moment(date).format('DD/MM/YYYY'));
}

export const dateInMorningWork = (date) => {
    var startTime = Constant.START_MORNING_WORK.fullFormat;
    var endTime = Constant.END_MORNING_WORK.fullFormat;

    return dateInDateRangerWorkingDay(date, startTime, endTime)
}

export const dateInAfternoonWork = (date) => {
    var startTime = Constant.START_AFTERNOON_WORK.fullFormat;
    var endTime = Constant.END_AFTERNOON_WORK.fullFormat;

    return dateInDateRangerWorkingDay(date, startTime, endTime)
}

export const dateInLunchTime = (date) => {
    var startTime = Constant.LUNCH_TIME.start;
    var endTime = Constant.LUNCH_TIME.end;

    return dateInDateRangerLunchTime(date, startTime, endTime)
}

export const dateInDateRangerWorkingDay = (date, startTime, endTime) => {
    let currentDate = new Date(date);
    let startDate = new Date(currentDate.getTime());

    startDate.setHours(Number(startTime.split(':')[0]));
    startDate.setMinutes(Number(startTime.split(':')[1]));
    startDate.setSeconds(Number(startTime.split(':')[2]));

    let endDate = new Date(currentDate.getTime());
    endDate.setHours(Number(endTime.split(':')[0]));
    endDate.setMinutes(Number(endTime.split(':')[1]));
    endDate.setSeconds(Number(endTime.split(':')[2]));

    return startDate <= currentDate && endDate >= currentDate;
}

export const dateInDateRangerLunchTime = (date, startTime, endTime) => {
    let currentDate = new Date(date);
    let startDate = new Date(currentDate.getTime());

    startDate.setHours(Number(startTime.split(':')[0]));
    startDate.setMinutes(Number(startTime.split(':')[1]));
    startDate.setSeconds(Number(startTime.split(':')[2]));

    let endDate = new Date(currentDate.getTime());
    endDate.setHours(Number(endTime.split(':')[0]));
    endDate.setMinutes(Number(endTime.split(':')[1]));
    endDate.setSeconds(Number(endTime.split(':')[2]));

    return startDate < currentDate && endDate > currentDate;
}

export const getDaysByHours = (hours) => {
    let day = 0;
    let subDay = 0;
    if (Math.floor( hours / 8 ) >= 1) {
        day = Math.floor( hours / 8 );
    }
    if (hours % 8 > 1 && hours % 8 <= 3) {
        subDay = 1/4;
    }

    if (hours % 8 > 3 && hours % 8 <= 5) {
        subDay = 1/2;
    }

    if (hours % 8 > 5 && hours % 8 <= 7) {
        subDay = 3/4;
    }
    return day +  subDay;
}


export const leaveShortDays = (startDate, endDate) => {
    let fromAt = new Date(startDate);
    let toAt = new Date(endDate);

    let startOfMorningWork = new Date(startDate);
    let endOfMorningWork = new Date(startDate);
    let startOfAfternoonWork = new Date(endDate);
    let endOfAfternoonWork = new Date(endDate);

    setTime(startOfMorningWork, endOfMorningWork, startOfAfternoonWork, endOfAfternoonWork);

    let leaveMorning = 0;
    let leaveAfternoon = 0;
    let numberOfWorkingDays = 0;

    if (isNoLeave(fromAt, toAt)) {
        return {hours: 0, days: 0};
    } else {
        if (dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            leaveMorning = toHours(endOfMorningWork.getTime() - fromAt.getTime());
            leaveAfternoon = toHours(toAt.getTime() - startOfAfternoonWork.getTime())
        }

        if (dateInMorningWork(fromAt) && !dateInAfternoonWork(toAt)) {
            leaveMorning = toHours(toAt.getTime() - fromAt.getTime());
            leaveAfternoon = 0;
        }

        if (!dateInMorningWork(fromAt) && dateInAfternoonWork(toAt)) {
            leaveMorning = 0;
            leaveAfternoon = toHours(toAt.getTime() - fromAt.getTime());
        }
        return {
            hours: numberOfWorkingDays * Constant.TIME_OF_WORKING_DAY + leaveMorning + leaveAfternoon,
            days: getDaysByHours(numberOfWorkingDays * Constant.TIME_OF_WORKING_DAY + leaveMorning + leaveAfternoon)
        };
    }
}

export const leaveLongDays = (startDate, endDate, dateArray) => {
    let fromAt = new Date(startDate);
    let toAt = new Date(endDate);

    let startOfMorningWork = new Date(startDate);
    let endOfMorningWork = new Date(endDate);
    let startOfAfternoonWork = new Date(startDate);
    let endOfAfternoonWork = new Date(endDate);
    let numberOfWorkingDays = dateArray.length;

    setTime(startOfMorningWork, endOfMorningWork, startOfAfternoonWork, endOfAfternoonWork);

    let leaveOfStartTime = {hours: 0, days: 0};
    let leaveOfEndTime = {hours: 0, days: 0};

    let endTimeOfLeaveStartTime = moment(startDate);
    endTimeOfLeaveStartTime.hours(17);
    endTimeOfLeaveStartTime.minutes(30);

    let startTimeOfLeaveEndTime = moment(endDate);
    startTimeOfLeaveEndTime.hours(8);
    startTimeOfLeaveEndTime.minutes(0);

    if (isNoLeave(fromAt, toAt)) {
        return {hours: 0, days: 0};
    } else {
        leaveOfStartTime = leaveShortDays(startDate, endTimeOfLeaveStartTime);
        leaveOfEndTime = leaveShortDays(startTimeOfLeaveEndTime, endDate);
    }
    return {
        hours: (numberOfWorkingDays - 2) * Constant.TIME_OF_WORKING_DAY  + leaveOfStartTime.hours + leaveOfEndTime.hours,
        days: (numberOfWorkingDays - 2) + leaveOfStartTime.days + leaveOfEndTime.days
    };
}

export const getLeaveTime = (startDate, endDate) => {
    if (typeof startDate === 'string') {
        startDate = moment(startDate, 'DD/MM/YYYY, HH:mm');
    }
    if (typeof endDate === 'string') {
        endDate = moment(endDate, 'DD/MM/YYYY, HH:mm');
    }
    let leaveTime = {
        hours: 0, days: 0
    };
    let datesArray = convertDateRangerToDateArray(startDate, endDate);
    datesArray = unsetWeekends(datesArray);
    datesArray = unsetHolidays(datesArray);
    if (datesArray.length == Constant.IS_NO_LEAVE) {
    } else if (datesArray.length == Constant.IS_LEAVE_SHORT) {
        leaveTime = leaveShortDays(startDate, endDate);
    } else {
        leaveTime = leaveLongDays(startDate, endDate, datesArray);
    }
    return leaveTime;
}

export const getTimeRemainingByLeaveType = (selectedLeaveType, allTimeRemaining) => {
    let annualLeave = allTimeRemaining.find(element => element.leaveType === Constant.ANNUAL_LEAVE);
    let annualLeaveRemaining = annualLeave ? annualLeave.totalLeaveTime - annualLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING
    let annualLeaveRemainPreviousYear = allTimeRemaining.find(element => element.leaveType === Constant.ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR);
    let annualLeaveRemainPreviousYearRemaining = annualLeaveRemainPreviousYear ? annualLeaveRemainPreviousYear.totalLeaveTime - annualLeaveRemainPreviousYear.leaveTimeUsed : Constant.INIT_TIME_REMAINING
    let compensatoryLeave = allTimeRemaining.find(element => element.leaveType === Constant.COMPENSATORY_LEAVE);
    let compensatoryLeaveRemaining = compensatoryLeave ? compensatoryLeave.totalLeaveTime - compensatoryLeave.leaveTimeUsed : Constant.INIT_TIME_REMAINING

    switch (selectedLeaveType) {
        case Constant.ANNUAL_LEAVE : return annualLeaveRemaining;
        case Constant.ANNUAL_LEAVE_REMAIN_PREVIOUS_YEAR : return annualLeaveRemainPreviousYearRemaining;
        case Constant.COMPENSATORY_LEAVE : return compensatoryLeaveRemaining;
        case Constant.WEDDING_LEAVE : return Constant.WEDDING_LEAVE_REMAINING;
        case Constant.CHILD_WEDDING_LEAVE : return Constant.CHILD_WEDDING_LEAVE_REMAINING;
        case Constant.FUNERAL_LEAVE : return Constant.FUNERAL_LEAVE_REMAINING;
        case Constant.UNPAID_LEAVE : return Constant.UNPAID_LEAVE_REMAINING;
        case Constant.OTHER_LEAVE : return Constant.OTHER_LEAVE_REMAINING;
        default : return Constant.INIT_TIME_REMAINING;
    }
}


