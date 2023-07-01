import {FormlyFieldConfig, FormlyTemplateOptions} from "@ngx-formly/core";
import {EventEmitter} from "@angular/core";

export interface CurrencyInputFormlyTypeConfig extends FormlyFieldConfig {
  templateOptions?: CurrencyInputFormlyTypeTemplateOptions;
}

export interface CurrencyInputFormlyTypeTemplateOptions extends FormlyTemplateOptions {
  style?: string;
  mask?: string;
  minMoney?:number;
  maxMoney?:number;
  thousandSeparator?: string;
  resetOnInvalid?: boolean;
  isFocused?: boolean;
  onBlur?: EventEmitter<string>;
}

