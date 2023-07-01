

import {  FormlyFieldConfig, FormlyTemplateOptions } from "@ngx-formly/core";

export interface TextFormlyTypeConfig extends FormlyFieldConfig {
    templateOptions?: TextFormlyTypeTemplateOptions;
}

export interface TextFormlyTypeTemplateOptions extends FormlyTemplateOptions {
  textClassName?: string;
  type?: 'normal'
}

