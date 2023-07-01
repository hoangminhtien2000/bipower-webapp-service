import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import * as moment from 'moment';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";
import {dateFromToValidator} from "../../helpers/validators";

@Component({
  selector: 'app-core-daterange-formly-type',
  templateUrl: './daterange-formly-type.component.html',
  styleUrls: ['./daterange-formly-type.component.css']
})
export class DaterangeFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {
  constructor(private localeService: BsLocaleService, private validationsLoader: ValidationLoaderFormlyService) {
    super();
    this.validationsLoader.init();
  }

  locale = 'vi';

  isOpen = false;
  defaultDate;



  // tslint:disable-next-line: member-ordering
  @ViewChild(RemoveWrapperDirective) directive = null;
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if(this.to.removeParentTag){
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
  }

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      },
      validators: {
        dateFromTo: dateFromToValidator
      }
    };
  }


  ngOnInit() {

    if (this.field.templateOptions.locale) {
      this.locale = this.field.templateOptions.locale;
    }
    this.localeService.use(this.locale);

    if (this.field.defaultValue) {
      this.defaultDate = [moment(this.field.defaultValue[0], 'DD/MM/YYYY').toDate(), moment(this.field.defaultValue[1], 'DD/MM/YYYY').toDate()];
      this.formControl.setValue(this.defaultDate)
    }
  }

  onBlur(event) {
    this.field.templateOptions.isFocused = false;
    if (!this.formControl.value
        || !this.formControl.value[0]
        || !this.formControl.value[1]
        || this.formControl.value.length !=2
        ||  moment(this.formControl.value[0]).toDate().getFullYear().toString().length != 4
        || moment(this.formControl.value[1]).toDate().getFullYear().toString().length != 4) {
      this.formControl.setValue(null);
    }
  }

}
