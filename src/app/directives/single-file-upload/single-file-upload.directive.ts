import {Directive, ElementRef, Renderer2} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor} from "@angular/forms";

@Directive({
    selector: "input[single-file]",
    host : {
        "(change)" : "onChange($event.target.files[0])",
        "(blur)": "onTouched()"
    },
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: SingleFileUpload, multi: true }
    ]
})
export class SingleFileUpload implements ControlValueAccessor {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    value: any;
    onChange = (_) => {};
    onTouched = () => {};
    constructor(renderer: Renderer2, elementRef: ElementRef){
        this._renderer = renderer;
        this._elementRef = elementRef;
    }
    writeValue(value) {}
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; }
    setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}