import {
    Component,
    Input,
    OnInit
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import * as moment from "moment";

@Component({
    selector: 'app-time-range',
    templateUrl: './time-range.component.html',
    styleUrls: ['./time-range.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: TimeRangeComponent,
            multi: true
        }
    ]
})
export class TimeRangeComponent implements OnInit, ControlValueAccessor {

    @Input() formControl: any
    controlValue = {
        from: new Date(),
        to: new Date()
    }
    value: string;
    @Input() placeholder = "";


    _changeFn = (val) => {
    };
    _touchFn = (val) => {
    };
    disabled: boolean = false;
    unsubscribe$ = new Subject();

    from = new Date();
    to = new Date();

    display = '';


    writeValue(obj: any): void {
        const current = new Date();
        this.from = obj?.from || current;
        this.to = obj?.to || current;
    }

    registerOnChange(fn: any): void {
        this._changeFn = fn;
        this._changeFn(this.controlValue);
    }

    registerOnTouched(fn: any): void {
        this._touchFn = fn;
    }

    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    getDisplayText(): void {
        setTimeout(() => {
            this.display = `${moment(this.controlValue.from).format('HH:mm')} - ${moment(this.controlValue.to).format('HH:mm')}`;
        })
    }

    ngOnInit(): void {
        this.getDisplayText();
        this.controlValue = this.formControl.value
    }

    updateValue(from: Date, to: Date): void {
        this.from = from;
        this.to = to;
        this.controlValue = {
            from, to
        };
        this._changeFn(this.controlValue);
        this.getDisplayText();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
