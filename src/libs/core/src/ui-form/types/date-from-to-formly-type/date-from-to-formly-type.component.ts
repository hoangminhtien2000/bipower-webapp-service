import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from "@angular/forms";
import {FieldType, FormlyExtension, FormlyFieldConfig} from "@ngx-formly/core";
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-core-date-from-to-formly-type',
    templateUrl: './date-from-to-formly-type.component.html',
    styleUrls: ['./date-from-to-formly-type.component.css']
})
export class DateFromToFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {

    constructor(private validationsLoader: ValidationLoaderFormlyService) {
        super();
        this.validationsLoader.init();
    }


    prePopulate(field: FormlyFieldConfig): void {
        this.defaultOptions = {
            templateOptions: {
                descriptionWrapper: false,
                validationWrapper: false
            }
        };
        // Tự thêm type là date và key là fromDate, toDate
        // @ts-ignore
        field.parent.model[field.key] = {};
        field.fieldGroup = field.fieldGroup.map((f, i) => {
            return {
                ...f,
                key: i === 0 ? "fromDate" : "toDate",
                className: "pl-0 pr-0 col-6 date-ft",
            }
        });
    }

    onPopulate(field: FormlyFieldConfig): void {

    }

    fromDateControl: FormControl;
    toDateControl: FormControl;

    ngOnInit(): void {
        const formGroup = this.formControl as FormGroup;

        this.fromDateControl = formGroup.get('fromDate') as FormControl;
        this.toDateControl = formGroup.get('toDate') as FormControl;
        if (!this.fromDateControl || !this.toDateControl) {
            return;
        }

        //Thêm validator cho from date
        this.fromDateControl.setValidators([
            this.fromDateControl.validator,
            this.fromDateValidator.bind(this)
        ]);
        //Thêm validator cho to date
        this.toDateControl.setValidators([
            this.toDateControl.validator,
            this.toDateValidator.bind(this)
        ]);

        //Reset lại to date khi from date thay đổi
        this.fromDateControl.valueChanges.pipe(
            distinctUntilChanged()
        ).subscribe(value => {
            // this.toDateControl.setValue(this.toDateControl.value)
            this.toDateControl.updateValueAndValidity();
        });
        // //Reset lại from date khi to date thay đổi
        this.toDateControl.valueChanges.pipe(
            distinctUntilChanged()
        ).subscribe(value => {
            // this.fromDateControl.setValue(this.fromDateControl.value)
            this.fromDateControl.updateValueAndValidity();
        });
    }

    toDateValidator(control: AbstractControl) {
        if (!control.value) return null;
        if (!this.fromDateControl) return null;
        if (!this.fromDateControl.value) return null;
        if (this.fromDateControl.value > control.value) {
            return {
                toDateRangeInvalid: {
                    destinationLabel: this.field.fieldGroup[0].templateOptions.label
                }
            }
        }
        return null;
    }

    fromDateValidator(control: AbstractControl) {
        if (!control.value) return null;
        if (!this.toDateControl) return null;
        if (!this.toDateControl.value) return null;
        if (this.toDateControl.value < control.value) {
            return {
                fromDateRangeInvalid: {
                    destinationLabel: this.field.fieldGroup[1].templateOptions.label
                }
            }
        }
        return null;
    }
}
