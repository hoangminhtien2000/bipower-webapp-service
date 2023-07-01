import * as moment from 'moment';
import { AbstractControl, FormGroup } from '@angular/forms';
export function getDateFromKeyString(origin, key): Date {
    if (origin) {
        if (origin._d) {
            origin = origin._d
        }
        const result = new Date(origin)
        if (key === 'today') {
            return origin
        }
        if (key.indexOf('dayago') !== -1) {
            const numberOfDay = +key.replace('dayago', '')
            result.setDate(origin.getDate() - numberOfDay)
            return result
        }
        if (key.indexOf('monthago') !== -1) {
            const numberOfMonth = +key.replace('monthago', '')
            result.setMonth(origin.getMonth() - numberOfMonth)
            return result
        }
        if (key.indexOf('yearago') !== -1) {
            const numberOfYear = +key.replace('yearago', '')
            result.setFullYear(origin.getFullYear() - numberOfYear)
            return result
        }
        if (key.indexOf('dayfromnow') !== -1) {
            const numberOfDay = +key.replace('dayfromnow', '')
            result.setDate(origin.getDate() + numberOfDay)
            return result
        }
        if (key.indexOf('monthfromnow') !== -1) {
            const numberOfMonth = +key.replace('monthfromnow', '')
            result.setMonth(origin.getMonth() + numberOfMonth)
            return result
        }
        if (key.indexOf('yearfromnow') !== -1) {
            const numberOfYear = +key.replace('yearfromnow', '')
            result.setFullYear(origin.getFullYear() + numberOfYear)
            return result
        }
        return moment(key, 'DD/MM/YYYY HH:mm:ss').toDate()
    }
}

export function mergeObject(target: any, source: any, fields?: string[]) {
    for (let k in source) {
        if (fields && fields.indexOf(k) !== -1) {
            target[k] = source[k];
            continue;
        }
        if (!fields) {
            target[k] = source[k];
            continue;
        }
    }
}

export function setTo12Hour(dateInput, formatDate?): Date {
    let resultDate = null;
    if (formatDate) {
        resultDate = moment(dateInput, formatDate).toDate();
    } else if (moment(dateInput).isValid()) {
        resultDate = moment(dateInput).toDate();
    }
    if (resultDate) {
        resultDate.setHours(12);
        resultDate.setMinutes(0);
        resultDate.setSeconds(0);
        return resultDate
    }
    return null;
}



export function generateDate(day, month, year, hour, min, second) {
    let result = new Date();
    result.setDate(day);
    result.setMonth(month);
    result.setFullYear(year);
    result.setHours(hour);
    result.setMinutes(min);
    result.setSeconds(second);
    return result;
}

export function getDateStringFormat(date, format) {
    if (!date) {
        return null;
    }
    return moment(date).format(format);
}

export function getResponseErrorMessage(httpError) {
    if (!httpError || !httpError.error) {
        return null;
    }
    if (httpError.error.error) {
        return httpError.error.error;
    }
    if (httpError.error.description) {
        return httpError.error.description;
    }
    if (httpError.error.message) {
        return httpError.error.message;
    }
    return httpError.error;
}

export function getResponseErrorMessageByException(httpError) {
    if (!httpError || !httpError.error) {
        return null;
    }
    if (httpError.error.error) {
        return httpError.error.error;
    }
    if (httpError.error.description) {
        return httpError.error.description;
    }
    if (httpError.error.message) {
        try {
            let message = JSON.parse(httpError.error.message);
            if (message.message && message.message != '' && message.message != null) {
                return message.message;
            }
        } catch (e) {
            if (httpError.error.message) {
                return httpError.error.message;
            }
        }
    }
    return httpError.error;
}


export function getMomentToDate(dateInput) {
    if (dateInput && moment(dateInput).isValid()) {
        return moment(dateInput).toDate();
    } else {
        return null;
    }
}

export function markAllControlsAsTouched(formGroup: AbstractControl | FormGroup | any) {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(key => {
        const control: any = formGroup.controls[key];
        control.markAsTouched();
        if (control.controls) {
            markAllControlsAsTouched(control);
        }
    });
}

export function markAllControlsAsDirty(formGroup: AbstractControl | FormGroup | any) {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(key => {
        const control: any = formGroup.controls[key];
        control.markAsDirty();
        if (control.controls) {
            markAllControlsAsDirty(control);
        }
    });
}

export function showControlsInfo(formGroup: FormGroup) {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(key => {
        const control: any = formGroup.controls[key];
        if (control.controls) {
            showControlsInfo(control);
        }
    });
}

export function showControlsError(formGroup: FormGroup) {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(key => {
        const control: any = formGroup.controls[key];
        if (control.errors) {
        }
        if (control.controls) {
            showControlsError(control);
        }
    });
}

export function updateValueAndValidator(formGroup: FormGroup) {
    if (!formGroup) {
      return;
    }
    Object.keys(formGroup.controls).forEach(key => {
        const control: any = formGroup.controls[key];
        control.updateValueAndValidity();
        if (control.controls) {
            updateValueAndValidator(control);
        }
    });
}

export function isValidValue(value) {
    if (value === undefined || value === null || value === '') {
        return false;
    }
    return true;
}
