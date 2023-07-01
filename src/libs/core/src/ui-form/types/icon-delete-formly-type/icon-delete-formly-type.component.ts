import { Component} from '@angular/core';
import {FormlyExtension, FormlyFieldConfig} from "@ngx-formly/core";
import {ModelFormlyFieldConfig} from "../advances/model-formly-type.model";
import {IconDeleteFormlyTypeConfig} from "./icon-delete-formly-type.config";

@Component({
  selector: 'app-core-icon-delete-formly-type',
  templateUrl: './icon-delete-formly-type.component.html',
  styleUrls: ['./icon-delete-formly-type.component.css']
})
export class IconDeleteFormlyTypeComponent extends ModelFormlyFieldConfig<any, IconDeleteFormlyTypeConfig>
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

  onRemoveData(){
    // @ts-ignore
    let val = this.model[this.key];
    this.formControl.setValue(val);
  }

}
