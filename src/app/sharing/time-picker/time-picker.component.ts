import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import * as moment from "moment";

@Component({
    selector: 'app-time-picker',
    templateUrl: './time-picker.component.html',
    styleUrls: ['./time-picker.component.css']
})
export class TimePickerComponent implements OnInit, OnChanges {

    @Input() minHour: number = 0;
    @Input() minMinute: number = 0;
    @Input() defaultValue = new Date();
    @Output() change = new EventEmitter();

    hourRange: number[] = [];
    minuteRange: number[] = [];

    hour = 0;
    minute = 0;

    constructor(private elRef: ElementRef) {
    }

    ngOnInit(): void {
        this.initRange();
        this.hour = this.defaultValue.getHours();
        this.minute = this.defaultValue.getMinutes();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['hour'] && this.minHour) {
            if (this.hour < this.minHour) {
                this.emitChange(this.minHour, this.minute);
            }
        }

        if (changes['minute'] && this.minMinute) {
            if (this.hour <= this.minHour && this.minute < this.minMinute) {
                this.emitChange(this.hour, this.minMinute);
            }
        }
    }

    initRange(): void {
        this.hourRange = [...Array(24).keys()];
        this.minuteRange = [...Array(60).keys()];
    }

    emitChange(h: number, m: number): void {
        this.hour = h;
        this.minute = m;
        const newValue = moment().set({hour: this.hour, minute: this.minute, second: 0});
        this.change.emit(newValue.toDate());
    }


}
