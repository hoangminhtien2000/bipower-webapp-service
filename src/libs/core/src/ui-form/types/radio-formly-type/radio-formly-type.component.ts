import {Component, OnInit, ViewChild} from '@angular/core';
import {FieldType, FormlyExtension, FormlyFieldConfig} from '@ngx-formly/core';
import {HttpClient} from '@angular/common/http';
import {ValidationLoaderFormlyService} from '../../services/validation-loader-formly.service';
import {TranslateService} from '@ngx-translate/core';
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
    selector: 'app-core-radio-formly-type',
    templateUrl: './radio-formly-type.component.html',
    styleUrls: ['./radio-formly-type.component.css']
})
export class RadioFormlyTypeComponent extends FieldType implements OnInit, FormlyExtension {

    rnd: string = '';
    display: string;
    class: string;
    URL: string;
    defaultValue;


    // tslint:disable-next-line: member-ordering
    @ViewChild(RemoveWrapperDirective) directive = null;
    constructor(private http: HttpClient, private validationsLoader:
        ValidationLoaderFormlyService,
        private translate: TranslateService) {
        super();
        this.validationsLoader.init();
        this.rnd = this.makeid(5);
    }

    // tslint:disable-next-line: use-life-cycle-interface
    ngAfterViewInit() {
        if (this.to.removeParentTag) {
            this.directive.removeParentTag();
        }
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
            }
        };
    }

    makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    ngOnInit() {
        const defaultValue = this.field.defaultValue;
        if (defaultValue) {
            this.field.formControl.setValue(defaultValue);
        }
        const options = this.field.templateOptions.options;
        this.display = this.field.templateOptions.display;
        this.URL = this.field.templateOptions.api;
        if (this.display && this.display === 'horizontal-inline') {
            this.class = 'form-group-horizontal-inline';
        } else if (this.display && this.display === 'horizontal') {
            this.class = 'form-group-horizontal';
        }
        if (options) {
            this.convertArrayOptions(options);
        } else if (this.URL) {
            this.http.get(this.URL).subscribe(response => {
                if (response) {
                    this.convertArrayOptions(response);
                }
            });
        }
    }

    /** Hàm để kiểm tra và chuyển đổi mảng để hiển thị lên control, trong trường hợp tên object truyền vào không đúng định dạng của control này */
    convertArrayOptions(options) {
        if (this.to.valueKey) {
            this.to.options = (options as any[]).map(row => {
                return {
                    value: row[this.to.valueKey], //Lấy setting name từ field config truyền vào
                    label: row[this.to.labelKey] //để lấy được ra giá trị tương ứng và bind lại vào object mới của mảng mới
                };
            });
        } else {
            this.to.options = (options as any[]).map(row => {
                return {
                    value: row.value,
                    label: this.translate.instant(row.label)
                }
            });
        }
    }

}
