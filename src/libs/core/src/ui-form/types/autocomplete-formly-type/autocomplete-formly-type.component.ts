import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {BehaviorSubject, Subject, Subscription} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {FormGroup} from '@angular/forms';
import {NgSelectComponent} from '@ng-select/ng-select';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {debounceTime} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import * as _ from 'lodash';
import {ModelFormlyFieldConfig} from "../advances/model-formly-type.model";
import {ApiConfiguration, ApiOption, AutocompleteFormlyConfig} from "./autocomplete-formly-type.config";
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";
import {ValueTools} from "../../../../../../app/core/common/tools/value-tools";

@Component({
  selector: 'app-core-autocomplete-formly-type',
  templateUrl: './autocomplete-formly-type.component.html',
  styleUrls: ['./autocomplete-formly-type.component.css']
})
export class AutocompleteFormlyTypeComponent extends ModelFormlyFieldConfig<any, AutocompleteFormlyConfig>
    implements OnInit, AfterViewInit, OnDestroy, FormlyExtension {
  @ViewChild('myautocomplete') myautocomplete: NgSelectComponent;
  onDestroy$ = new Subject<void>();
  URL: string;
  selectedId: any;
  subscription: Subscription;
  oldValue: any;
  oldUrl: string;
  public search$ = new BehaviorSubject<string | null>('');
  preOptions: ApiOption[] = [];
  @ViewChild(RemoveWrapperDirective) directive = null;

  constructor(private http: HttpClient,
    private validationsLoader: ValidationLoaderFormlyService,
    private translate: TranslateService
  ) {
    super();
    this.validationsLoader.init();
  }

  private get isApiObject(): boolean {
    return this.to.api &&
      typeof this.to.api !== 'string';
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.to.removeParentTag) {
      this.directive.removeParentTag();
    }
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
    if (this.field.focus && this.myautocomplete) {
      this.myautocomplete.focus();
    }
    // setTimeout(() => {
    //     this.field.formControl.reset();
    // }, 1000);
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

    const defaultValue = this.field.defaultValue;
    if (typeof defaultValue !== 'undefined' && defaultValue !== null) {
      this.selectedId = defaultValue;
    }

    this.preOptions = this.to.preOptions;
    // @ts-ignore
    const modelValue = this.model[this.field.key];

    if (modelValue !== undefined) {
      this.selectedId = modelValue;
    }

    this.formControl.valueChanges.subscribe(val => {
      if (val && typeof val === "string"
        && this.to.options
        && (this.to.options as []).length > 0
        && typeof this.to.options[0].value === "number") {
        if (this.field.key === "selectedOrdinate") {
        }
        this.selectedId = parseInt(val);
      }
    });

    const options = this.to.options;
    if (options && !this.to.api) {
      this.convertArrayOptions(options);
    } else {
      const apiConfig: ApiConfiguration | string = this.to.api;
      if (typeof apiConfig === 'string') {
        this.http.get(apiConfig).subscribe(response => {
          if (response) {
            this.convertArrayOptions(response);
          }
        });
      } else if (typeof apiConfig === 'object') {
        let url = apiConfig.url;
        const params = {};
        if (apiConfig.params) {
          for (const i of Object.keys(apiConfig.params)) {
            params[i] = apiConfig.params[i];
          }
        }
        if (apiConfig.dynamicParams) {
          this.subscription = (<FormGroup>this.field.parent.formControl).valueChanges.pipe(debounceTime(500)).subscribe(
            (value: any) => {
              const newValue: any = {};
              for (const i of Object.keys(apiConfig.dynamicParams)) {
                if (i.startsWith('$')) {
                  const keysss = i.substring(1, i.length);
                  url = apiConfig.url.replace(`:${keysss}`, value[apiConfig.dynamicParams[i]]);
                } else {
                  newValue[i] = value[apiConfig.dynamicParams[i]];
                }
              }
              if (!_.isEqual(newValue, this.oldValue) || url !== this.oldUrl) {
                this.oldValue = newValue;
                this.oldUrl = url;
                for (const i of Object.keys(newValue)) {
                  params[i] = value[apiConfig.dynamicParams[i]];
                }
                this.getDynamicUrl(url, params);
              }
            }
          );
          for (const i of Object.keys(apiConfig.dynamicParams)) {
            params[i] = '';
          }
        }

        if (apiConfig.lazySearch || apiConfig.onInputChange) {
          const key = typeof apiConfig.lazySearch === 'string' ? apiConfig.lazySearch : 'input';
          this.search$.pipe(debounceTime(500)).subscribe((value) => {
            if (apiConfig.onInputChange) {
              apiConfig.onInputChange(value);
            } else {
              if (this.to.api.url === url) {
                if (value) {
                  params[key] = value;
                } else {
                  params[key] = '';
                }
                this.getData(this.to.api.url, params);
              } else {
                this.getDataDynamic(value);
              }
            }
          });
        }
        else {
          this.getData(this.to.api.url, params);
        }
      }
    }
  }

  getData(url, params) {
    this.http.get(url, { params: _.omitBy(params, _.isNil) }).subscribe(response => {
      if (response) {
        this.convertArrayOptions(response);
      }
    });

  }

  getDataDynamic(value) {
    let key = typeof this.to.api.lazySearch === 'string' ? this.to.api.lazySearch : 'input';
    let params = {};
    if (this.to.api.params) {
      params = this.to.api.params;
    }
    let url = this.to.api.url;
    if (value) {
      params[key] = value;
    } else {
      params[key] = '';
    }
    this.http.get(url, { params: _.omitBy(params, _.isNil) }).subscribe(response => {
      if (response) {
        this.convertArrayOptions(response);
      }
    });

  }

  getDynamicUrl(url, params) {
    let fixedURL = url;
    if (params) {
      fixedURL = fixedURL.includes('?') ? fixedURL.concat('&') : fixedURL.concat('?');
    }
    for (const n of Object.keys(params)) {
      if (params[n]) {
        fixedURL = fixedURL.concat(n, '=', params[n], '&');
      }
    }
    fixedURL = fixedURL.slice(0, -1);

    this.http.get(fixedURL).subscribe(response => {
      if (response) {
        this.convertArrayOptions(response);
        // @ts-ignore
        this.formState[this.field.key] = JSON.parse(JSON.stringify(response));
      }
    });

  }

  convertArrayOptions(options) {
    let convertOptions: any[];
    if (this.isApiObject
      && (this.to.api as ApiConfiguration).responsePath) {
      options = _.get(options, (this.to.api as ApiConfiguration).responsePath, []);
    }
    if (this.to.valueKey) {
      //Trường hợp valueKey là object phức tạp
      if (this.to.valueKey.indexOf('.') !== -1) {
        const value = this.to.valueKey.split(/\.(?=[^\.]+$)/); //Trường hợp value có dạng phức tạp như sau thì cần phải cắt ra: "content.addressCode"

        if (typeof this.to.labelKey === 'string') {
          const label = this.to.labelKey.split(/\.(?=[^\.]+$)/); // tương tự bên trên: "content.abc.addressName"
          convertOptions = (options[value[0]] as []).map(row => {
            return {
              value: _.get(row, this.to.valueKey, row[value[1]]),
              // label: row[label[1]]
              label: _.get(row, this.to.labelKey, row[label[1]]),
              all: row,
            };
          });
        } else if (Array.isArray(this.to.labelKey)) {
          convertOptions = options.map(row => {
            const labelValues: string[] = (this.to.labelKey as string[])
              .map(labelKey => _.get(row, labelKey, row[labelKey]));
            return {
              value: _.get(row, this.to.valueKey, ''),
              label: this.to.labelPattern ? ValueTools.formart(this.to.labelPattern, labelValues) : labelValues.join(' - '),
              all: row,
            };
          });
        }
      } else {
        //Trường hợp valueKey là array
        if (typeof this.to.labelKey === 'string') {
          convertOptions = (options as any[]).map(row => {
            return {
              value: _.get(row, this.to.valueKey
                , row[this.to.valueKey]), //Lấy setting name từ field config truyền vào
              label: _.get(row, this.to.labelKey
                , row[this.to.labelKey as string]), //để lấy được ra giá trị tương ứng và bind lại vào object mới của mảng mới
              all: row
            };
          });
        } else if (Array.isArray(this.to.labelKey)) {
          convertOptions = (options as []).map(row => {
            const labelValues: string[] = (this.to.labelKey as string[])
              .map(labelKey => _.get(row, labelKey, row[labelKey]));
            return {
              value: _.get(row, this.to.valueKey, row[this.to.valueKey]),
              label: this.to.labelPattern
                ? ValueTools.formart(this.to.labelPattern, labelValues)
                : labelValues.join(' - '),
              all: row
            };
          });
        }
      }
    } else {
      //Trong trường hợp không có set valueKey thì sẽ không cần convert. Nhưng cần dịch đa ngôn ngữ
      convertOptions = (options as any[]).map(row => {
        return {
          value: row.value,
          label: this.translate.instant(row.label),
          all: { ...row },
        }
      });
    }
    this.to.options = this.preOptions
      ? [...this.preOptions, ...convertOptions]
      : convertOptions;
  }

  ngOnDestroy() {
    this.onDestroy$.complete();
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onFocus(event) {
    this.to.isFocused = true;
  }

  onBlur(event) {
    this.to.isFocused = false;
    this.myautocomplete.close();
  }

}
