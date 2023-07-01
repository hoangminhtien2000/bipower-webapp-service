export function minlengthValidationMessage(err, field) {
  return `Should have at least ${field.templateOptions.minLength} characters`;
}

export function maxlengthValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxLength} characters`;
}

export function minValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.min}`;
}

export function maxValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.max}`;
}

export function minMoneyValidationMessage(err, field) {
  return `This value should be more than ${field.templateOptions.minMoney}`;
}

export function maxMoneyValidationMessage(err, field) {
  return `This value should be less than ${field.templateOptions.maxMoney}`;
}

export function requireValidationMessage(err, field) {
  return `"${field.templateOptions.label}"` + ' bắt buộc phải nhập'
}


export function toDateRangeValidationMsg(err, field) {
  return `"${field.templateOptions.label}" ${field.templateOptions.lessThanError} "${err.destinationLabel}"`
};
export function fromDateRangeValidationMsg(err, field) {
  return `"${field.templateOptions.label}" ${field.templateOptions.greaterThanError} "${err.destinationLabel}"`
};
