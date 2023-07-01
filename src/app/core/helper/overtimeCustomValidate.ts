import {AbstractControl} from "@angular/forms";
import * as moment from "moment/moment";

export const dayOvertimeInvalid = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let currentDate = moment();
        currentDate = removeTime(currentDate)
        let date = moment(control.value);
        date = removeTime(date);
        var duration = moment.duration(date.diff(currentDate));
        var days = duration.asDays();
        if (days > 7) {
            return {biggestSevenDays: true};
        }
        if (days < -7) {
            return {smallThanSevenDays: true};
        }
    };
}

export const holidayTimeRule = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        var isWeekend = control.value.getDay() % 6 == 0;
        if (isWeekend == true) {
            return {holidayTimeRule: true}
        }
        return null
    };
}

// export const notHolidayTime = () => {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//         var isWeekend = control.value.getDay() % 6 == 0;
//         if (isWeekend == true) {
//             return null
//         }
//         return {notHolidayTime: true}
//     };
// }

export const startHourOffical = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let startTime = control.value;
        var startTimeCompare = parseInt(startTime.replace(':', ''));
        var startTimeOfficalDefault = parseInt("08:00".replace(':', ''));
        var endTimeOfficalDefault = parseInt("17:30".replace(':', ''));
        if (startTimeCompare >= startTimeOfficalDefault && startTimeCompare <= endTimeOfficalDefault) {
            return {startHourOffical: true}
        } else {
            return null
        }
    };
}

export const endHourOffical = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let endTime = control.value;
        var endTimeCompare = parseInt(endTime.replace(':', ''));
        var startTimeOfficalDefault = parseInt("08:00".replace(':', ''));
        var endTimeOfficalDefault = parseInt("17:30".replace(':', ''));
        if (endTimeCompare >= startTimeOfficalDefault && endTimeCompare <= endTimeOfficalDefault) {
            return {endHourOffical: true}
        } else {
            return null
        }
    };
}

const removeTime = (time) => {
    time.hours(0);
    time.minutes(0);
    time.seconds(0);
    time.milliseconds(0);
    return time;
}