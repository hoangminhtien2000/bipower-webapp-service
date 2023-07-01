import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {HttpClient} from '@angular/common/http';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import * as _ from 'lodash';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'app-core-select-formly-type',
  templateUrl: './select-formly-type.component.html',
  styleUrls: ['./select-formly-type.component.css']
})
export class SelectFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {

  constructor(private http: HttpClient, private validationsLoader: ValidationLoaderFormlyService,
    private translate: TranslateService) {
    super();
    this.validationsLoader.init();
  }

  compareFn: any;
  URL: string;
  itemdefault: string[];
  showDefaultOption: boolean = true;

  // tslint:disable-next-line: member-ordering
  @ViewChild(RemoveWrapperDirective) directive = null;
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.to.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }

    if (this.to.required) {
      if (this.formControl.value !== undefined && this.formControl.value !== null) {
        this.showDefaultOption = false;
      }
      this.formControl.valueChanges.subscribe(value => {
        if (value !== undefined && value !== null) {
          this.showDefaultOption = false;
        }
      });
    }

  }

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      }
    };
  }

  ngOnInit() {
    this.URL = this.field.templateOptions.api;
    const options = this.field.templateOptions.options;
    // const defaultValue = this.field.defaultValue;
    // if (defaultValue) {
    //   this.field.model[this.field.key] = defaultValue;
    // }
    if (options) {
      this.convertArrayOptions(options)
    }
    else if (this.URL) {
      this.http.get(this.URL).subscribe(response => {
        if (response) {
          this.convertArrayOptions(response)
        }
      });
    }

    //CompareObject
    this.compareFn = this._compareFn.bind(this);
  }

  /** Hàm để kiểm tra và chuyển đổi mảng để hiển thị lên control, trong trường hợp tên object truyền vào không đúng định dạng của control này */
  convertArrayOptions(options) {
    if (this.to.valueKey) {
      if (this.to.valueKey.indexOf('.') !== -1) {
        const value = this.to.valueKey.split(/\.(?=[^\.]+$)/); //Trường hợp value có dạng phức tạp như sau thì cần phải cắt ra: "content.addressCode"
        const label = this.to.labelKey.split(/\.(?=[^\.]+$)/); // tương tự bên trên: "content.abc.addressName"
        this.to.options = (options[value[0]] as []).map(row => {
            return {
              value: _.get(row, this.to.valueKey, row[value[1]]),
              // label: row[label[1]]
              label: _.get(row, this.to.labelKey, row[label[1]])
            };
          });
      } else {
        this.to.options = (options as any[]).map((row) => {
          return {
            value: row[this.to.valueKey],      //Lấy setting name từ field config truyền vào
            label: row[this.to.labelKey]   //để lấy được ra giá trị tương ứng và bind lại vào object mới của mảng mới
          }
        });
      }
    }
    else {
      this.to.options = (options as any[]).map(row => {
        return {
          value: row.value,
          label: this.translate.instant(row.label)
        }
      });
    }
  }

  onFocus(event) {
    this.field.templateOptions.isFocused = true;
  }

  onBlur(event) {
    this.field.templateOptions.isFocused = false;
  }

  _compareFn(a, b) {
    if (this.to.dataKey && a && b) {
      // Handle compare logic (eg check if unique ids are the same)
      return a[this.to.dataKey] === b[this.to.dataKey];
    } else {
      return a === b;
    }

  }
}
