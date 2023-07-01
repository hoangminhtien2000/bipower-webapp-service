import * as moment from 'moment';
import {FormControl} from '@angular/forms';
import {FormlyFieldConfig} from '@ngx-formly/core';

export function maximumMoneyValidator(control, type): boolean  {
  const value = control.value;

  if (value && type.templateOptions.maxMoney) {
    if (Number(value) > type.templateOptions.maxMoney) {
      return false;
    }
  }

  return true;
}


export function minimumMoneyValidator(control, type):  boolean {
  const value = control.value;

  if (value && type.templateOptions.minMoney) {
    if (Number(value) < type.templateOptions.minMoney) {
      return false;
    }
  }

  return true;
}

export function maxDateValidator(control: FormControl, type): boolean {
  if (control.value && type.templateOptions && type.templateOptions.maxDate) {
    const maxOption = moment(type.templateOptions.maxDate, 'DD/MM/YYYY').add(1, 'day').toDate();
    if (control.value >= maxOption) {
      return false;
    }
  }
  return true;
}

export function dateFromToValidator(control: FormControl, type): boolean {
  if (control.value && control.value[0] && control.value[1]) {
    if (control.value[0] > control.value[1]) {
      return false;
    }
  }
  return true;
}

export function minDateValidator(control: FormControl, type): boolean {
  if (control.value && type.templateOptions && type.templateOptions.minDate) {
    const minOption = moment(type.templateOptions.minDate, 'DD/MM/YYYY').toDate();
    if (control.value < minOption) {
      return false;
    }
  }
  return true;
}


export function fixlengthValidator(control: FormControl, type): boolean {
  if (control.value && type.templateOptions && type.templateOptions.fixlength) {
    return control.value.length === type.templateOptions.fixlength;
  }
  return true;
}

export function patternValidator(control: FormControl, type: FormlyFieldConfig): boolean {
  if (control.value && type.templateOptions && type.templateOptions.pattern) {
    const reg = new RegExp(type.templateOptions.pattern);
    return reg.test(control.value);
  }
  return true;
}
