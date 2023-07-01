import {AfterViewInit, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {fixlengthValidator, patternValidator} from '../../helpers/validators';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
  selector: 'app-core-input-formly-type',
  templateUrl: './input-formly-type.component.html',
  styleUrls: ['./input-formly-type.component.css']
})
export class InputFormlyTypeComponent extends FieldType
  implements OnInit, AfterViewInit, FormlyExtension {

  isReadOnly: boolean;
  @ViewChild(RemoveWrapperDirective) directive = null;
  us: any;

  constructor(private validationsLoader: ValidationLoaderFormlyService, private cd: ChangeDetectorRef, private _renderer: Renderer2) {
    super();
    this.validationsLoader.init();
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
        fixlength: fixlengthValidator
      }
    };
  }

  ngOnInit() {
    this.isReadOnly = this.field.templateOptions.isReadOnly;
  }

  ngAfterViewInit() {
    if (this.to.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
    this.cd.detectChanges();
  }

  onChange(val: string) {
    if (val && this.model) {
      val = val.trim();
      // @ts-ignore
      this.model[this.key] = val;
      this.formControl.setValue(val);

      if (this.field.templateOptions.pattern) {
        const matchs = val.match(this.field.templateOptions.pattern);
        if (matchs) {
          this.formControl.setValue(matchs.length > 0 ? matchs[0] : '');
        }
      }
    }

  }

  editInput(isReadOnly: any) {
    this.isReadOnly = !isReadOnly;
  }


  onFocus(event) {
    this.field.templateOptions.isFocused = true;
    if (this.to.resetOnInvalid && this.formControl.invalid) {
      this.formControl.setValue('');
    }
  }

  onBlur(event) {
    if (this.to.onBlurInput) {
      this.to.onBlurInput(event.target.value, this.field);
    }
    this.field.templateOptions.isFocused = false;
    if (this.to.trimZero && this.formControl.value && this.formControl.value.indexOf('0') == 0) {
      this.formControl.setValue(this.formControl.value.replace('0', ''));
    }
  }
}
