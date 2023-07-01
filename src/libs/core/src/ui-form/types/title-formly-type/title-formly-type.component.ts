import { Component} from '@angular/core';
import {FormlyExtension, FormlyFieldConfig} from "@ngx-formly/core";
import {TitleFormlyTypeConfig} from "./title-formly-type.config";
import {ModelFormlyFieldConfig} from "../advances/model-formly-type.model";

@Component({
  selector: 'app-core-title-formly-type',
  templateUrl: './title-formly-type.component.html',
  styleUrls: ['./title-formly-type.component.css']
})
export class TitleFormlyTypeComponent extends ModelFormlyFieldConfig<any, TitleFormlyTypeConfig>
  implements FormlyExtension  {

  constructor() {
    super();
  }

  onPopulate(field: FormlyFieldConfig): void {
  }

  postPopulate(field: FormlyFieldConfig): void {
  }

  prePopulate(field: FormlyFieldConfig): void {
  }


}
