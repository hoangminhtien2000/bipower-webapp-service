import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FieldType,
  FormlyExtension,
  FormlyFieldConfig,
} from "@ngx-formly/core";
import { fromEvent, ReplaySubject, Subject } from "rxjs";
import { debounceTime, startWith, takeUntil } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { ValidationLoaderFormlyService } from "../../services/validation-loader-formly.service";
import { NgSelectComponent } from "@ng-select/ng-select";
import { RemoveWrapperDirective } from "../../../directives/remove-wrapper.directive";
import { MultiSelect } from "primeng/multiselect";

@Component({
  selector: "app-multiselect-formly-short-type",
  templateUrl: "./multiselect-formly-short-type.component.html",
  styleUrls: ["./multiselect-formly-short-type.component.css"],
})
export class MultiselectFormlyShortTypeComponent
  extends FieldType
  implements OnDestroy, OnInit, FormlyExtension {
  URL: string;
  selectedItem: any = "";
  apiConfig: any;
  onDestroy$ = new Subject<void>();
  filterChangeDestroy = new Subject<any>();
  search$ = new EventEmitter();
  options$;
  savedInitValue = "";
  saveUrl: string;
  saveParams: any;

  @ViewChild("mymultiselect") mymultiselect: NgSelectComponent;

  // tslint:disable-next-line: member-ordering
  @ViewChild(RemoveWrapperDirective) directive = null;
  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewInit() {
    if (this.to.removeFormlyFieldTag) {
      this.directive.removeFormlyFieldTag();
    }
  }

  prePopulate(field: FormlyFieldConfig): void {
    this.defaultOptions = {
      templateOptions: {
        descriptionWrapper: false,
        validationWrapper: false,
        hideLabel: true,
      },
    };
  }

  constructor(
    private http: HttpClient,
    private validationsLoader: ValidationLoaderFormlyService
  ) {
    super();
    this.validationsLoader.init();
  }

  ngOnInit() {
    this.apiConfig = this.field.templateOptions.api;
    // @ts-ignore
    const defaultModel = this.model[this.field.key];
    if (defaultModel) {
      this.selectedItem = defaultModel;
    }

    const options = this.field.templateOptions.options;
    this.URL = this.field.templateOptions.api;
    if (options) {
      this.convertArrayOptions(options);
    } else if (this.URL) {
      this.http.get(this.URL).subscribe((response) => {
        if (response) {
          this.convertArrayOptions(response);
        }
      });
    }



    this.to.dataSubject = new ReplaySubject();
    this.to.dataSubject.subscribe((data) => {
      this.selectedItem = data;
    });

    this.formControl.valueChanges.subscribe((val) => {
      if (
        val &&
        typeof val === "string" &&
        this.to.options &&
        (this.to.options as []).length > 0 &&
        val.indexOf(this.to.separator) !== -1
      ) {
        this.selectedItem = this.filterArray(
          this.to.options,
          val.split(this.to.separator)
        );
        setTimeout(() => {
          this.onChangeSelected({ value: this.selectedItem });
        }, 100);
      }

      if (!this.to.options || (this.to.options as []).length == 0) {
        const interval = setInterval(() => {
          if (this.to.options && (this.to.options as []).length > 0) {
            if (val && typeof val === "string") {
              this.selectedItem = this.filterArray(
                this.to.options,
                val.split(this.to.separator)
              );
              setTimeout(() => {
                this.onChangeSelected({ value: this.selectedItem });
              }, 100);
              clearInterval(interval);
            } else if (val) {
              this.selectedItem = val;
              clearInterval(interval);
            }
          }
        }, 100);
      }
    });
  }

  onChangeSelected(event) {
    if (event.value && this.to.selectedAsString) {
      let a = "";
      const b = this.to.separator;
      event.value.forEach(function (elem) {
        a += elem.value + b;
      });
      // @ts-ignore
      this.model[this.field.key] = a;
    }
  }

  /** Hàm để kiểm tra và chuyển đổi mảng để hiển thị lên control, trong trường hợp tên object truyền vào không đúng định dạng của control này */
  convertArrayOptions(options) {
    if (this.to.valueKey) {
      this.to.options = (options as any[]).map((row) => {
        return {
          value: row[this.to.valueKey], //Lấy setting name từ field config truyền vào
          label: row[this.to.labelKey], //để lấy được ra giá trị tương ứng và bind lại vào object mới của mảng mới
        };
      });
    } else {
      //Trong trường hợp không có set valueKey thì sẽ không cần convert. Nhưng cần dịch đa ngôn ngữ
      this.to.options = (options as any[]).map((row) => {
        return {
          value: row.value,
          label: row.label,
        };
      });
    }

    if (this.selectedItem && typeof this.selectedItem === "string") {
      let arr = [];
      if (this.selectedItem.indexOf(this.to.separator) !== -1) {
        arr = this.selectedItem.split(this.to.separator);
      }
      if (
        this.to.options &&
        (this.to.options as []).length > 0 &&
        arr.length > 0
      ) {
        this.selectedItem = this.filterArray(this.to.options, arr);
      }
    }
  }

  filterArray(array, ids) {
    return array.filter(function (a) {
      return ids.indexOf(a.value + "") !== -1;
    });
  }

  ngOnDestroy() {
    this.onDestroy$.complete();
  }

  deleteSelected(val, $event) {
    $event.stopPropagation();
    this.selectedItem = this.selectedItem.filter((a) => a !== val);
    setTimeout(() => {
      this.onChangeSelected({ value: this.selectedItem });
    }, 500);
  }

  isArray(array) {
    return Array.isArray(array) && array.length > 0;
  }

  onFocus(event) {
    this.field.templateOptions.isFocused = true;
  }

  onBlur(event) {
    this.field.templateOptions.isFocused = false;
    this.mymultiselect.close();
  }

  onHide() {
    if (!this.apiConfig) {
      return;
    }
    this.filterChangeDestroy.next();
  }

  onOpen(multiSelect: MultiSelect) {
    if (!this.apiConfig) {
      return;
    }
    const filterInput = multiSelect.filterInputChild.nativeElement;
    fromEvent(filterInput, "keydown")
      .pipe(
        takeUntil(this.filterChangeDestroy),
        debounceTime(500),
        startWith(filterInput.value)
      )
      .subscribe(() => {
        this.getDynamicUrl({
          ...this.saveParams,
          name: filterInput.value,
        });
      });
  }

  getDynamicUrl(params) {
    params &&
      Object.keys(params).forEach((key) => {
        if (!params[key]) {
          delete params[key];
        }
      });
    this.http
      .get(this.saveUrl, { params: params })
      .toPromise()
      .then((response) => {
        if (response) {
          this.to.options = [];
          this.convertArrayOptions(response);
          // @ts-ignore
          this.formState[this.field.key] = JSON.parse(JSON.stringify(response));
        }
      });
  }
}
