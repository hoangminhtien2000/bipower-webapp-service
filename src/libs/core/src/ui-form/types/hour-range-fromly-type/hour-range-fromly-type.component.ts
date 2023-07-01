import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    Input,
    OnInit,
    Renderer2,
    ViewChild
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Subject} from "rxjs";
import {FieldType, FormlyExtension, FormlyFieldConfig} from "@ngx-formly/core";
import {ValidationLoaderFormlyService} from "../../services/validation-loader-formly.service";
import {fixlengthValidator, patternValidator} from "../../helpers/validators";
import {RemoveWrapperDirective} from "../../../directives/remove-wrapper.directive";

@Component({
    selector: 'app-core-hour-range-formly-type',
    templateUrl: './hour-range-fromly-type.component.html',
    styleUrls: ['./hour-range-fromly-type.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: HourRangeFromlyTypeComponent,
            multi: true
        }
    ]
})
export class HourRangeFromlyTypeComponent extends FieldType
    implements OnInit, AfterViewInit, FormlyExtension {

    @ViewChild(RemoveWrapperDirective) directive = null;

    @Input() placeholder = "";


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

    ngAfterViewInit(): void {
        if (this.to.removeParentTag) {
            this.directive.removeParentTag();
        }
        if (this.to.removeFormlyFieldTag) {
            this.directive.removeFormlyFieldTag();
        }
        this.cd.detectChanges();
    }

    ngOnInit(): void {
    }
}
