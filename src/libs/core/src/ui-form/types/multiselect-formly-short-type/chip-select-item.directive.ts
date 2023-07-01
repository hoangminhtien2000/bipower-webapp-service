import { Directive, ElementRef, Input, OnDestroy, OnInit } from "@angular/core";
import { MultiSelect } from "primeng/multiselect";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { NgControl } from "@angular/forms";
@Directive({
    selector: "[appChipSelectItem1]",
})
export class ChipSelectItemDirective1 implements OnInit, OnDestroy {
    @Input() chipLabel: string;
    unsubscribe$ = new Subject<void>();
    constructor(
        private elRef: ElementRef<HTMLElement>,
        private ngControl: NgControl,
        private mul: MultiSelect
    ) { }
    ngOnInit() {
        this.execute();
        this.ngControl.valueChanges
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe((value) => {
                this.execute();
            });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    checkIndexItemOutSide = 0;
    checkHaveItemOutSide = false;
    check = 0;
    execute(): void {
        setTimeout(() => {
            const currentValue = this.mul.value;
            const optionLabel = this.mul.optionLabel;
            const container = this.elRef.nativeElement;
            const parent = container.querySelector(
                ".p-multiselect-label"
            ) as HTMLElement;
            const chipChildren = Array.from(
                parent.querySelectorAll(".multiselect-chip")
            ) as HTMLElement[];
            chipChildren.forEach((element, idx) => {
                element.classList.remove("bi-hidden");
                element.innerText = currentValue[idx][this.chipLabel || optionLabel];
            });
            let index = chipChildren.findIndex((child) =>
                this.isElementOutside(child, parent)
            );
            if (this.check == 0 && chipChildren.length > 0) {
                this.checkIndexItemOutSide = 1;
                this.checkHaveItemOutSide = true;
            }
            if (index > -1 && this.checkHaveItemOutSide == false) {
                this.checkIndexItemOutSide = chipChildren.length;
                this.checkHaveItemOutSide = true;
            }
            if (index == -1 && this.checkHaveItemOutSide == true) {
                this.checkIndexItemOutSide = chipChildren.length;
                this.checkHaveItemOutSide = false;
            }
            // if (currentValue.length == chipChildren.length) {
            //     index = 1;
            //     this.checkIndexItemOutSide = 1;
            //     this.checkHaveItemOutSide = true;
            // }
            if (chipChildren.length == 0) {
                this.check = 0;
            } else {
                this.check = 1;
            }
            chipChildren.forEach((element, idx) => {
                element.innerText = currentValue[idx][this.chipLabel || optionLabel];
                element.classList.add("float-left");
                if (index > -1) {
                    if (idx > this.checkIndexItemOutSide) {
                        element.classList.add("bi-hidden");
                    }
                    if (idx == this.checkIndexItemOutSide - 1 && chipChildren.length > 1) {
                        element.classList.add("w-l-70");
                    }
                    if (idx == this.checkIndexItemOutSide) {
                        element.innerText = `+${chipChildren.length - this.checkIndexItemOutSide
                        }`;
                    }
                }
            });
        });
    }
    isElementOutside(element: HTMLElement, parent: HTMLElement): boolean {
        const padding = window
            .getComputedStyle(parent, null)
            .paddingLeft.replace("px", "");
        return (
            element.offsetLeft + element.offsetWidth >=
            parent.clientWidth - 50 - Number(padding) * 2
        );
    }
}
