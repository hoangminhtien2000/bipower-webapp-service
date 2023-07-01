import {Directive, ElementRef, HostListener, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {FormControl, NgControl} from "@angular/forms";
import {DecimalPipe} from "@angular/common";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

@Directive({
    selector: '[appCurencyFormat]'
})
export class CurencyFormatDirective implements OnInit, OnDestroy {

    unsubscribe$ = new Subject();

    constructor(private ngControl: NgControl,
                private elRef: ElementRef,
                private render: Renderer2,
                private decimalPipe: DecimalPipe) {
    }

    ngOnInit() {
        this.format();
        this.ngControl.control.valueChanges.pipe(
            takeUntil(this.unsubscribe$)
        ).subscribe(value => {
            this.format();
        })
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    format(): void {
        const currentValue = String(this.ngControl.control.value || '')
            .replace(/,/g, '')
            .replace(/\D/g,'')
            .replace(' ', '').trim();
        const display = `${this.decimalPipe.transform(currentValue, '1.0') || ''}`;
        (this.elRef.nativeElement as HTMLInputElement).value = display;
        (this.ngControl.control as FormControl).setValue(currentValue, {
            emitEvent: false,
            emitModelToViewChange: false,
            emitViewToModelChange: false
        })
    }

}
