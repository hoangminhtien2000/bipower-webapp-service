import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {getDateFromKeyString} from '../../helpers/common-function';
import {maxDateValidator, minDateValidator} from '../../helpers/validators';
import * as moment from 'moment';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
  selector: 'app-core-date-formly-type',
  templateUrl: './date-formly-type.component.html',
  styleUrls: ['./date-formly-type.component.css']
})

export class DateFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {

  locale = 'vi';
  defaultDate: Date;

  minDate: Date;
  maxDate: Date;
  today = new Date()

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      },
      validators: {
        maxDate: maxDateValidator,
        minDate: minDateValidator
      }
    };
  }

  // tslint:disable-next-line: member-ordering
  @ViewChild(RemoveWrapperDirective) directive = null;

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.to.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
    if (this.field.defaultValue && this.formControl) {
      if (typeof this.field.defaultValue == 'string') {
        this.defaultDate = getDateFromKeyString(this.today, this.field.defaultValue);
        this.formControl.setValue(this.defaultDate);
      } else {
        this.formControl.patchValue(this.field.defaultValue);
      }
    }
  }

  constructor(private localeService: BsLocaleService, private validationsLoader: ValidationLoaderFormlyService) {
    super();
    this.validationsLoader.init();
  }

  ngOnInit() {
    if (this.field.templateOptions.locale) {
      this.locale = this.field.templateOptions.locale;
    }
    this.localeService.use(this.locale);

    if (this.to.minDate) {
      this.minDate = getDateFromKeyString(this.today, this.field.templateOptions.minDate);
    }
    if (this.to.maxDate) {
      this.maxDate = getDateFromKeyString(this.today, this.field.templateOptions.maxDate)
    }
    this.formControl.valueChanges.subscribe(value => {
    });
  }

  onIncreaseMonth() {
    const fromDateControl = this.formControl.parent.controls['fromDate']
    if (this.formControl && fromDateControl) {
      let dateRange = moment(moment(this.formControl.value).startOf('day')).diff(moment(fromDateControl.value).startOf('day'), 'days');
      const dateRangeToNow = moment().diff(this.formControl.value, 'days');
      if (dateRangeToNow == 0) {
        return;
      }
      if (dateRangeToNow < dateRange) {
        dateRange = dateRangeToNow;
      }
      const toDateTime = getDateFromKeyString(this.formControl.value, `${ dateRange }dayfromnow`)
      const fromDateTime = getDateFromKeyString(fromDateControl.value, `${ dateRange }dayfromnow`)
      this.formControl.setValue(toDateTime);
      fromDateControl.setValue(fromDateTime);
      fromDateControl.markAsTouched();
      this.formControl.markAsTouched();
    }
  }

  onIncreaseDay() {
    const fromDateControl = this.formControl.parent.controls['fromDate'];
    const toDateControl = this.formControl.parent.controls['toDate'];

    let dateSpace: number = moment(toDateControl.value).diff(moment(fromDateControl.value), 'days');
    if (dateSpace == 0) {
      dateSpace = 1;
    }
    const currentDate = moment(new Date()).startOf('days');
    toDateControl.setValue(new Date(moment(toDateControl.value).startOf('days').add(dateSpace, 'days').toDate()));
    fromDateControl.setValue(new Date(moment(fromDateControl.value).startOf('days').add(dateSpace, 'days').toDate()));
    if (moment(toDateControl.value) > moment(currentDate)) {
      const dateSpaceFuture = moment(toDateControl.value).diff(moment(currentDate), 'days');
      toDateControl.setValue(new Date(moment(toDateControl.value).startOf('days').subtract(dateSpaceFuture, 'days').toDate()));
      fromDateControl.setValue(new Date(moment(fromDateControl.value).startOf('days').subtract(dateSpaceFuture, 'days').toDate()));
    }
  }

  onDecreaseMonth() {
    const toDateControl = this.formControl.parent.controls['toDate']
    if (this.formControl && toDateControl) {
      const dateRange = moment(moment(toDateControl.value).startOf('day')).diff(moment(this.formControl.value).startOf('day'), 'days');
      const fromDateTime = getDateFromKeyString(this.formControl.value, `${ dateRange }dayago`)
      const toDateTime = getDateFromKeyString(toDateControl.value, `${ dateRange }dayago`)
      this.formControl.setValue(fromDateTime);
      toDateControl.setValue(toDateTime);
      toDateControl.markAsTouched();
      this.formControl.markAsTouched();
    }
  }

  onDecreaseDay() {
    const fromDateControl = this.formControl.parent.controls['fromDate'];
    const toDateControl = this.formControl.parent.controls['toDate'];

    let dateSpace: number = moment(toDateControl.value).diff(moment(fromDateControl.value), 'days');
    if (dateSpace == 0) {
      dateSpace = 1;
    }

    toDateControl.setValue(new Date(moment(toDateControl.value).startOf('days').subtract(dateSpace, 'days').toDate()));
    fromDateControl.setValue(new Date(moment(fromDateControl.value).startOf('days').subtract(dateSpace, 'days').toDate()));
    fromDateControl.markAsTouched();
    toDateControl.markAsTouched();
  }

  onFocus(event) {
    this.field.templateOptions.isFocused = true;
  }

  onBlur(event) {
    this.field.templateOptions.isFocused = false;
    if (!this.formControl.value || moment(this.formControl.value).toDate().getFullYear().toString().length != 4) {
      this.formControl.setValue(null);
    }
  }


}


