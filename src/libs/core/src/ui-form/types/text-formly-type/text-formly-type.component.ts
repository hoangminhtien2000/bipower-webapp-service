import {DecimalPipe} from "@angular/common";
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {TranslateService} from "@ngx-translate/core";
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {ModelFormlyFieldConfig} from "../advances/model-formly-type.model";
import {TextFormlyTypeConfig} from "./text-formly-type.config";
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
  selector: 'vt88-core-text-formly-type',
  templateUrl: './text-formly-type.component.html',
  styleUrls: ['./text-formly-type.component.scss'],
  providers: [DecimalPipe]
})
export class TextFormlyTypeComponent extends ModelFormlyFieldConfig<string, TextFormlyTypeConfig>
  implements OnInit, AfterViewInit, FormlyExtension {

  @ViewChild(RemoveWrapperDirective) directive = null;

  constructor(private currency: DecimalPipe
    , private trans: TranslateService
    , private validationsLoader: ValidationLoaderFormlyService) {
    super();
    this.validationsLoader.init();
  }

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        type: 'normal'
        , textClassName: ''
      }
    } as TextFormlyTypeConfig;
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    if (this.field.templateOptions.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.field.templateOptions.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
  }
}
