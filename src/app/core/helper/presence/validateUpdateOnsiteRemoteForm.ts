import {AbstractControl} from "@angular/forms";
import {Constant} from "./constants";
import * as moment from "moment/moment";
import {holidays} from "../../../../environments/environment";

export const getDate = (date) => {
    return moment(date, 'DD/MM/YYYY, hh:mm');
}

export const startLessThanStartWorkingDay = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let start = getDate(control.value.startDate);
        if ((start.hours() > Constant.START_MORNING_WORK.hours)
            || (start.hours() === Constant.START_MORNING_WORK.hours && start.minutes() >= Constant.START_MORNING_WORK.minutes)) {
            return null;
        }
        return {startLessThanStartWorkingDay: true};
    };
}

export const endBiggerThanEndWorkingDay = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let end = getDate(control.value.endDate);
        if ((end.hours() < Constant.END_AFTERNOON_WORK.hours)
            || (end.hours() === Constant.END_AFTERNOON_WORK.hours && end.minutes() <= Constant.START_AFTERNOON_WORK.minutes)) {
            return null;
        }
        return {endBiggerThanEndWorkingDay: true};
    };
}

export const startDateLessThanEndDate = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let start = getDate(control.value.startDate);
        let end = getDate(control.value.endDate);
        if (
            start < end
        ) {
            return null;
        }
        return {endLessThanStart: true};
    };
}

export const noLunchTime = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
       if (dateInLunchTime(control.value.startDate)) {
           return {startInLunchTime: true}
       }
       if (dateInLunchTime(control.value.endDate)) {
           return {endInLunchTime: true}
       }
       return null;
    };
}

export const dateInLunchTime = (selectedDate) => {
    let date = getDate(selectedDate);
    let startLunchTime = getDate(selectedDate);
    startLunchTime.hours(Constant.START_LUNCH.hours);
    startLunchTime.minutes(Constant.START_LUNCH.minutes);
    let endLunchTime = getDate(selectedDate);
    endLunchTime.hours(Constant.END_LUNCH.hours);
    endLunchTime.minutes(Constant.END_LUNCH.minutes);
    return startLunchTime < date && date < endLunchTime;
}

export const noWorkingDays = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let start = getDate(control.value.startDate);
        let end = getDate(control.value.endDate);
        if (isWeekends(start) || isHolidays(start)) {
            return {
                startIsNoWorkingDay: true
            }
        }
        if (isWeekends(end) || isHolidays(end)) {
            return {
                endIsNoWorkingDay: true
            }
        }
        return null;
    };
}

export const noOnsiteRemote = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (Number(control.value) === Constant.IS_NO_LEAVE) {
            return {
                noLeave: true
            }
        }
        return null;
    };
}

function isWeekends (date) {
    return moment(date).day() == Constant.IS_SUNDAY || moment(date).day() == Constant.IS_SATURDAY;
}

function isHolidays (date) {
    let holidayShort = holidays.holiday_short;
    return !!holidayShort.find(element => moment(element).format('DD/MM/YYYY') === moment(date).format('DD/MM/YYYY'));
}

export const timeRegisteredLessThanTimeRemaining = (leaveType, timeRemaining, timeRegistered) => {
    if (leaveType === Constant.UNPAID_LEAVE ||
        leaveType === Constant.FUNERAL_LEAVE ||
        leaveType === Constant.WEDDING_LEAVE ||
        leaveType === Constant.CHILD_WEDDING_LEAVE ||
        leaveType === Constant.OTHER_LEAVE) {
        return false;
    }
    return Number(timeRegistered) > Number(timeRemaining);
}

