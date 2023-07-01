import {ValidatorFn} from "@angular/forms";

export const multiSelectRequire: ValidatorFn = control => {
    if (!control.value || control.value.length == 0) {
        return {
            required: true
        };
    }
    return null;
}