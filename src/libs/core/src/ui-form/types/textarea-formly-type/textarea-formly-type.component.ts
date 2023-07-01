import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
  selector: 'app-core-textarea-formly-type',
  templateUrl: './textarea-formly-type.component.html',
  styleUrls: ['./textarea-formly-type.component.css']
})
export class TextareaFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      }
    };
  }


  constructor(private validationsLoader: ValidationLoaderFormlyService) {
    super();
    this.validationsLoader.init();
  }

  ngOnInit() {
  }


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


  onFocus(event) {
    this.field.templateOptions.isFocused = true;
  }

  onBlur(event) {
    this.field.templateOptions.isFocused = false;
      // <!--TechAsians thêm trim-->
    if(this.to.trim && this.formControl.value){
      this.formControl.setValue(this.formControl.value.trim());
    }
  }

}
