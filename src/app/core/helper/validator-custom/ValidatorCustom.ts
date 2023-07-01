import {AbstractControl, FormControl, ValidationErrors, ValidatorFn} from "@angular/forms";
import * as moment from 'moment';
import {dateInLunchTime} from "../leave/calculateLeaveHours";

export class Constant {
    static NAME_RULE = "[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$";
    static PROJECT_NAME_RULE = "[0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s\\W|_]+$";
    static EMAIL_PATTERN = "[a-zA-Z0-9]+((.|_)[a-zA-Z0-9]+)*@([a-zA-Z]+\\.)+[a-zA-Z]+";
    static START_MORNING_WORK = {
        hours: 8, minutes: 0, fullFormat: '08:00:00'
    }
    static END_MORNING_WORK = {
        hours: 12, minutes: 0, fullFormat: '12:00:00'
    }
    static START_AFTERNOON_WORK = {
        hours: 13, minutes: 30, fullFormat: '13:30:00'
    }
    static END_AFTERNOON_WORK = {
        hours: 17, minutes: 30, fullFormat: '17:30:00'
    }

    static LUNCH_TIME = {
        start: '11:59:00', end: '13:31:00'
    }

    static LEAVE_REASON_MAX_LENGTH = 500;
    static TIME_OF_HALF_WORKING_DAY = 4;
    static TIME_OF_WORKING_DAY = 8;
    static IS_SATURDAY = 6;
    static IS_SUNDAY = 0;
    static IS_LEAVE_SHORT = 1;
    static SAVE = 'SAVE';
    static SAVE_AND_SEND = 'SAVE_END_SEND';
    static INIT_TIME_REMAINING = 0;
}

export const validDateCustom: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        if (!control.value) {
            return null;
        }
        let date = new Date(control.value);
        let dateStr = (date.getDate() + "").padStart(2, "0") + "/" + (date.getMonth() + "").padStart(2, "0") + "/" + date.getFullYear();
        let dateStrSplit = dateStr.split("/");
        const day = parseInt(dateStrSplit[0]);
        const month = parseInt(dateStrSplit[1]);
        const year = parseInt(dateStrSplit[2]);
        const newDate = new Date(year, month, day);
        const newDay = ("" + newDate.getDate()).padStart(2, "0");
        const newMonth = ("" + newDate.getMonth()).padStart(2, "0");
        const newYear = ("" + newDate.getFullYear()).padStart(4, "0");
        if (dateStr !== (newDay + "/" + newMonth + "/" + newYear)) {
            return {message: "Lỗi định dạng ngày", dateFormat: true};
        }
        return null;
    } catch (error) {
        return {message: "Lỗi định dạng ngày", dateFormat: true};
    }
};

export const validFileMaxSize: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        if (!control.value) {
            return null;
        }
        if (control.value && control.value.size / 1024 / 1024 > 5) {
            return {messageMaxSize: "Dung lượng ảnh không được quá 5MB!"}
        }
    } catch (error) {
        return null;
    }
};

export const validRequiredType: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        if (!control.value) {
            return null;
        }
        const typeAccepts = ["png", "jpg", "jpeg"]
        const nameSplit = control.value.name.split(".");
        const name = nameSplit[nameSplit.length - 1];
        if (control.value && typeAccepts.indexOf(name.toLocaleLowerCase()) < 0) {
            return {messageType: "Định dạng ảnh không đúng!"}
        } else {
            return null;
        }
    } catch (error) {
        return {messageType: "Lỗi định dạng file"};
    }
}

export const validRequiredTypeDoc: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        if (!control.value) {
            return null;
        }
        const typeAccepts = ["pdf", "docx"].map(el => el.toUpperCase())
        let sFileName = control.value.name;
        let sFileExtension = sFileName.split('.')[sFileName.split('.').length - 1].toLowerCase();
        if (typeAccepts.indexOf(sFileExtension.toUpperCase()) < 0) {
            return {messageType: "Định dạng file không đúng!"}
        } else {
            return null;
        }
    } catch (error) {
        return {messageType: "Lỗi định dạng file"};
    }
}

export const validaPhoneNumber: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        if (!control.value) {
            return null;
        }
        if (control.value.startsWith("0") == false) {
            return {messagePhone: "Số điện thoại phải bắt đầu bằng số 0.", startWithZero: true};
        } else if (control.value && /^0[0-9]{9}$/gi.test(control.value) === false) {
            return {messagePhone: "Số điện thoại không hợp lệ!", pattern: true}
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

export class CustomeDateValidators {
    static fromToDate(fromDateField: string, toDateField: string, errorName: string = 'fromToDate'): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField).value;
            const toDate = formGroup.get(toDateField).value;
            // Ausing the fromDate and toDate are numbers. In not convert them first after null check
            if (fromDate && toDate && (typeof fromDate == "object" && typeof toDate === "object")) {
                const firstDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0);
                const secondDate: Date = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0);
                if (firstDate.getTime() >= secondDate.getTime()) {
                    return {[errorName]: true};
                }
            }
            return null;
        };
    }
}

export class CustomeDateNotEqualValidators {
    static fromToDate(fromDateField: string, toDateField: string, errorName: string = 'fromToDate', day: number = 0): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField).value;
            const toDate = formGroup.get(toDateField).value;
            // Ausing the fromDate and toDate are numbers. In not convert them first after null check
            if (fromDate && toDate && (typeof fromDate == "object" && typeof toDate === "object")) {
                const firstDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0);
                const secondDate: Date = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0);
                if (firstDate.getTime() > secondDate.getTime() || moment(secondDate).diff(moment(firstDate), "days") < day) {
                    return {[errorName]: true};
                }
            }
            return null;
        };
    }

    static fromToDateTime(fromDateField: string, toDateField: string, errorName: string = 'fromToDate', day: number = 0): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField).value;
            const toDate = formGroup.get(toDateField).value;
            fromDate as Date;
            toDate as Date;
            // Ausing the fromDate and toDate are numbers. In not convert them first after null check
            if (fromDate && toDate && (typeof fromDate == "object" && typeof toDate === "object")) {
                const firstDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), fromDate.getHours(), fromDate.getMinutes(), 0);
                const secondDate: Date = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), toDate.getHours(), toDate.getMinutes(), 0);
                if (firstDate.getTime() > secondDate.getTime() || moment(secondDate).diff(moment(firstDate), "days") < day) {
                    return {[errorName]: true};
                }
                // if(firstDate.getTime() + 3600000 > secondDate.getTime() && moment(secondDate).diff(moment(firstDate),"days") == 0){
                //     return {[errorName + "_HOUR"]: true};
                // }
            }
            return null;
        };
    }

    static ValidateOTfromToDateTime(fromDateField: string, toDateField: string, errorName: string = 'validateOT'): ValidatorFn {
        return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
            const fromDate = formGroup.get(fromDateField).value;
            const toDate = formGroup.get(toDateField).value;
            fromDate as Date;
            toDate as Date;
            if (!fromDate || !toDate) {
                return null;
            }
            if (fromDate.getTime() > toDate.getTime()) {
                return null;
            }

            let minDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 17, 31, 0, 0);
            let maxDate = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate() + 1, 7, 59, 0, 0);

            if (minDate.getTime() > fromDate.getTime() || maxDate.getTime() < toDate.getTime()) {
                return {[errorName]: true};
            }

            return null;
        };
    }

    static rangeDate(day: number = 0) {
        return (control: AbstractControl): ValidationErrors | null => {
            try {
                if (control.value.length == 2) {
                    const fromDate = control.value[0];
                    const toDate = control.value[1];
                    if (!(fromDate && toDate)) {
                        control.setValue("");
                        return null;
                    }
                    if (fromDate && toDate && (typeof fromDate == "object" && typeof toDate === "object")) {
                        const firstDate: Date = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate(), 0, 0, 0);
                        const secondDate: Date = new Date(toDate.getFullYear(), toDate.getMonth(), toDate.getDate(), 0, 0, 0);
                        if (firstDate.getTime() > secondDate.getTime() || moment(secondDate).diff(moment(firstDate), "days") < day) {
                            return {rangeDate: true};
                        }
                    }
                    return null;
                }
            } catch (error) {
                return null;
            }
        }
    }
}

export const validateMaxCurrentDate: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    try {
        const dateValue: Date = new Date(control.value);
        const maxDate: Date = new Date();

        const firstDate: Date = new Date(dateValue.getFullYear(), dateValue.getMonth(), dateValue.getDate(), 0, 0, 0);
        const secondDate: Date = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 0, 0, 0);
        if (firstDate.getTime() > secondDate.getTime()) {
            return {maxDate: true}
        }
    } catch (error) {
        return null;
    }
}

export class ValidatorCustom {
    static maxLengthCurrency(len: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            try {
                let value = control.value;
                if (value) {
                    value = (value + "").replace(/,/g, "");
                    if (value.length > len) {
                        return {maxlength: true}
                    }
                } else {
                    return null;
                }
            } catch (error) {
                return null;
            }
        }
    }
}

export class RequireTypeFile {
    static typeFile(typeAccepts: string[] = ["png", "jpg", "jpeg"], multiple: boolean = false): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            try {
                let types = typeAccepts.reduce((preV, curV, currentIndex) => {
                    if (currentIndex == 0) {
                        preV = curV.toUpperCase();
                    } else {
                        preV += ", " + curV.toUpperCase();
                    }
                    return preV;
                }, "");
                if (multiple) {
                    let list: any[] = control.value;
                    for (let index = 0; index < list.length; index++) {
                        let currentControl = list[index];
                        if (!currentControl) {
                            return null;
                        }
                        const nameSplit = currentControl.name.split(".");
                        const name = nameSplit[nameSplit.length - 1];
                        if (currentControl && typeAccepts.indexOf(name.toLocaleLowerCase()) < 0) {
                            return {messageType: "Định dạng file không đúng!", types}
                        }
                    }
                    return null;
                } else {
                    if (!control.value) {
                        return null;
                    }
                    const nameSplit = control.value.name.split(".");
                    const name = nameSplit[nameSplit.length - 1];
                    if (control.value && typeAccepts.indexOf(name.toLocaleLowerCase()) < 0) {
                        return {messageType: "Định dạng file không đúng!", types}
                    } else {
                        return null;
                    }
                }
            } catch (error) {
                return null;
            }
        }
    }

    static maxSizeFile(maxSize: number = 5, multiple: boolean = false): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            try {
                if (multiple) {
                    let list: any[] = control.value;
                    for (let index = 0; index < list.length; index++) {
                        let currentControl = list[index];
                        if (!currentControl) {
                            return null;
                        }
                        if (currentControl && currentControl.size / 1024 / 1024 > maxSize) {
                            return {messageMaxSize: "Dung lượng ảnh không được quá 5MB!", maxSize}
                        }
                    }
                    return null;
                } else {
                    if (!control.value) {
                        return null;
                    }
                    if (control.value && control.value.size / 1024 / 1024 > maxSize) {
                        return {messageMaxSize: "Dung lượng ảnh không được quá 5MB!", maxSize}
                    }
                }
            } catch (error) {
                return null;
            }
        };
    }
}

export const leaveFromAt = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if ((new Date(control.value.startDate).getHours() < Constant.START_MORNING_WORK.hours)
            || (new Date(control.value.startDate).getHours() == Constant.START_MORNING_WORK.hours && new Date(control.value.startDate).getMinutes() <= Constant.START_MORNING_WORK.minutes)) {
            return {startDateAllowed: true};
        }
        return null;
    };
}

export const leaveToAt = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if ((new Date(control.value.endDate).getHours() > Constant.END_AFTERNOON_WORK.hours)
            || (new Date(control.value.endDate).getHours() == Constant.END_AFTERNOON_WORK.hours && new Date(control.value.endDate).getMinutes() >= Constant.END_AFTERNOON_WORK.hours)) {
            return {endDateAllowed: true};
        }
        return null;
    };
}

export const dateLessThan = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        if (
            new Date(control.value.endDate).getTime() <= new Date(control.value.startDate).getTime()
        ) {
            return {dateLessThan: true};
        }
        return null;
    };
}

export const lunchTime = () => {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
        let fromAt = new Date(control.value.startDate);
        let toAt = new Date(control.value.endDate);
        if (dateInLunchTime(fromAt) || dateInLunchTime(toAt)) {
            return {startLunch: dateInLunchTime(fromAt), endLunch: dateInLunchTime(toAt)};
        }
        return null;
    };
}

export const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
    // Remove extra spaces
    // Bỏ các khoảng trắng liền nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // Bỏ dấu câu, kí tự đặc biệt
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    return str;
}


