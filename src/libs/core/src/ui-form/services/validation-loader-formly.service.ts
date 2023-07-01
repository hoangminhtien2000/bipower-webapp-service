import {Injectable} from '@angular/core';
import {FormlyConfig, FormlyFieldConfig} from '@ngx-formly/core';
import {COMMON} from "../../../../../app/core/common/constant";
import {TranslateService} from "@ngx-translate/core";

@Injectable()
export class ValidationLoaderFormlyService {
    constructor(
        private translate: TranslateService,
        private formlyConfig: FormlyConfig) {
        this.init();
    }

    init(): void {
        //     // message without params
        this.formlyConfig.addValidatorMessage('required', (err, field) => this.requireValidationMessage(err, field));
        //     //
        //     // // message with params
        this.formlyConfig.addValidatorMessage('minlength', (err, field) => this.minlengthValidationMessage(err, field));
        this.formlyConfig.addValidatorMessage('maxlength', (err, field) => this.maxlengthValidationMessage(err, field));
        //     this.formlyConfig.addValidatorMessage('fixlength', (err, field) => this.fixlengthValidationMessage(err, field, this.translate));
        this.formlyConfig.addValidatorMessage('maxDate', (err, field) => this.maxDateValidationMessage(err, field, this.translate));
        this.formlyConfig.addValidatorMessage('minDate', (err, field) => this.minDateValidationMessage(err, field, this.translate));
        this.formlyConfig.addValidatorMessage('pattern', (err, field) => this.patternValidationMessage(err, field));
        this.formlyConfig.addValidatorMessage('dateFromTo', (err, field) => this.dateFromToValidationMessage(err, field));
        //     // this.formlyConfig.addValidatorMessage('min', (err, field) => this.minValidationMessage(err, field, this.translate));
        //     // this.formlyConfig.addValidatorMessage('max', (err, field) => this.maxValidationMessage(err, field, this.translate));
    }

    //

    private minlengthValidationMessage(err, field: FormlyFieldConfig) {
        return this.translate.instant('validations.minLength', {
            field: this.translate.instant(field.templateOptions.label),
            value: field.templateOptions.maxLength
        });
    }

    // //
    //
    //
    // private fixlengthValidationMessage(err, field: FormlyFieldConfig, translate: TranslateStorage) {
    //     return `"${this.translate.instant(field.templateOptions.label)}" \
    //     ${translate.instant('validations.fixlength', { 'number': field.templateOptions.fixlength })}`;
    // }
    //
    private maxlengthValidationMessage(err, field: FormlyFieldConfig) {
        return this.translate.instant('validations.maxLength', {
            field: this.translate.instant(field.templateOptions.label),
            value: field.templateOptions.maxLength
        });
    }

    private maxDateValidationMessage(err, field: FormlyFieldConfig, translate: TranslateService) {
        return translate.instant('validations.maxDate', {
            'date': field.templateOptions.maxDate,
            field: this.translate.instant(field.templateOptions.label)
        });
    }

    private minDateValidationMessage(err, field: FormlyFieldConfig, translate: TranslateService) {
        return translate.instant('validations.minDate', {
            'date': field.templateOptions.minDate,
            field: this.translate.instant(field.templateOptions.label)
        });
    }

    private patternValidationMessage(err, field: FormlyFieldConfig): string {
        if (field.templateOptions.label) {
            return this.translate.instant('validations.pattern', {
                field: this.translate.instant(field.templateOptions.label)
            });
        }
        return this.translate.instant('validations.pattern');
    }

    private dateFromToValidationMessage(err, field: FormlyFieldConfig): string {
        if (field.templateOptions.label) {
            return this.translate.instant('validations.dateFromTo', {
                field: this.translate.instant(field.templateOptions.label)
            });
        }
        return this.translate.instant('validations.dateFromTo');
    }

    //
    //
    //
    // // private minValidationMessage(err, field: FormlyFieldConfig, translate: TranslateService) {
    // //   return translate.instant('Validations.min', { 'number': field.templateOptions.min});
    // // }
    // //
    // // private maxValidationMessage(err, field: FormlyFieldConfig, translate: TranslateService) {
    // //   return translate.instant('Validations.max', { 'number': field.templateOptions.max});
    // // }
    //
    // }
    private requireValidationMessage(err, field): string {
        if (field.templateOptions.customLabel) {
            return this.translate.instant('validations.required', {
                field: this.translate.instant(field.templateOptions.customLabel)
            });
        }

        if (field.templateOptions.label) {
            return this.translate.instant('validations.required', {
                field: this.translate.instant(field.templateOptions.label)
            });
        } else {
            return this.translate.instant('validations.required');
        }
    }

    //
    // private minlengthValidationMessage(err: any, field: FormlyFieldConfig, translate: TranslateService) {
    //     return translate.instant('mobile.validations.minLength', { 'field': this.translate.instant(field.templateOptions.label), 'value': field.templateOptions.minLength });
    // }
}
