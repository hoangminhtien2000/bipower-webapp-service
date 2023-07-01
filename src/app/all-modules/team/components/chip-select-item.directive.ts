import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';
import {MultiSelect} from "primeng/multiselect";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {NgControl} from "@angular/forms";

@Directive({
    selector: '[appChipSelectItem]'
})
export class ChipSelectItemDirective implements OnInit, OnDestroy {

    @Input() chipLabel: string;
    unsubscribe$ = new Subject<void>();

    constructor(private elRef: ElementRef<HTMLElement>,
                private ngControl: NgControl,
                private mul: MultiSelect) {
    }

    ngOnInit() {
        this.execute();
        this.ngControl.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe(value => {
            this.execute();
        })
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    execute(): void {
        setTimeout(() => {
            const currentValue = this.mul.value;
            const optionLabel = this.mul.optionLabel;

            const container = this.elRef.nativeElement;
            const parent = container.querySelector('.p-multiselect-label') as HTMLElement;
            const chipChildren = Array.from(parent.querySelectorAll('.multiselect-chip')) as HTMLElement[];

            chipChildren.forEach((element, idx) => {
                element.classList.remove('bi-hidden');
                element.innerText = currentValue[idx][this.chipLabel || optionLabel];
            });
            const index = chipChildren.findIndex((child) => this.isElementOutside(child, parent));
            chipChildren.forEach((element, idx) => {
                element.innerText = currentValue[idx][this.chipLabel || optionLabel];
                if (index != -1 && idx > index) {
                    element.classList.add('bi-hidden');
                }
                if (idx == index) {
                    element.innerText = `+${chipChildren.length - index}`;
                }
                if (idx == index - 1) {
                }
            });
        });
    }

    isElementOutside(element: HTMLElement, parent: HTMLElement): boolean {
        const padding = window.getComputedStyle(parent, null).paddingLeft.replace('px', '');
        return (element.offsetLeft + element.offsetWidth) >= parent.clientWidth - 50 - (Number(padding) * 2);
    }

}
