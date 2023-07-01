import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from "@angular/core";
import {FormlyExtension, FormlyFieldConfig} from "@ngx-formly/core";
import {ModelFormlyFieldConfig} from "../advances/model-formly-type.model";
import {CurrencyInputFormlyTypeConfig} from "./currency-input-formly-type.config";
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";
import {ValidationLoaderFormlyService} from "../../services/validation-loader-formly.service";
import {patternValidator, fixlengthValidator, maximumMoneyValidator } from "../../helpers/validators";

@Component({
  selector: 'app-core-currency-input-formly-type',
  templateUrl: './currency-input-formly-type.component.html',
  styleUrls: ['./currency-input-formly-type.component.css']
})
export class CurrencyInputFormlyTypeComponent
    extends ModelFormlyFieldConfig<number, CurrencyInputFormlyTypeConfig> implements OnInit, AfterViewInit, FormlyExtension {
  @ViewChild(RemoveWrapperDirective) directive = null;

  constructor(private validationsLoader: ValidationLoaderFormlyService, private cd: ChangeDetectorRef) {
    super();
    this.validationsLoader.init();
  }

  get isReadOnly(): boolean {
    return this.field.templateOptions.isReadOnly;
  }

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      },
      validators: {
        pattern: patternValidator,
        fixlength: fixlengthValidator,
        maximumMoney: maximumMoneyValidator,
        minimumMoney: maximumMoneyValidator
      }
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    if (this.to.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
    this.cd.detectChanges();
    // if(this.formControl && LocalStorageTool.isLao()) {
    //   this.formControl.setValue('');
    // }
  }

  onChange(val: string) {
    if (val) {
      val = val.trim();
      this.formControl.setValue(val);
      if (this.field.templateOptions.pattern) {
        const matchs = val.match(this.field.templateOptions.pattern);
        if (matchs) {
          this.formControl.setValue(matchs.length > 0 ? matchs[0] : '');
        }
      }
    }
  }

  onFocus(event: string) {
    this.field.templateOptions.isFocused = true;
    if (this.field.templateOptions.resetOnInvalid && this.formControl.invalid) {
      this.formControl.setValue('');
    }
  }

  onBlur(event: string) {
    if (this.field.templateOptions.onBlur) {
      this.field.templateOptions.onBlur.emit(event);
    }
    this.field.templateOptions.isFocused = false;
  }
}
