import {ValidatorFn} from "@angular/forms";

export const multiselectRequire: ValidatorFn = control => {
    const value = control.value;
    if (value && value.length > 0) {
        return null;
    }
    return {
        required: true
    }
}