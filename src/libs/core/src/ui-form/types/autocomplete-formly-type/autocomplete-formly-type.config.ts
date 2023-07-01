import {FormlyFieldConfig, FormlyTemplateOptions} from "@ngx-formly/core";

export interface AutocompleteFormlyConfig extends FormlyFieldConfig {
  templateOptions?: AutocompleteFormlyTemplateOptions;
}

export interface AutocompleteFormlyTemplateOptions extends FormlyTemplateOptions {
  descriptionWrapper?: boolean;
  validationWrapper?: boolean;
  removeParentTag?: boolean;
  removeFormlyFieldTag?: boolean;
  preOptions?: ApiOption[];
  api?: ApiConfiguration | string;
  labelKey?: string | string[];
  valueKey?: string;
  labelPattern?: string;
  options?: ApiOption[];
  isFocused?: boolean;
  ouputSelectedAsObject?: boolean;
}

export interface ApiOption {
  value: string | number;
  label: string;
  data?: any;
}

export interface ApiConfiguration {
  url?: string;
  responsePath?: string;
  lazySearch?: boolean | string;
  params?: { [key: string]: string | number | boolean };
  dynamicParams?: { [key: string]: string };
  onInputChange?: Function;
}

