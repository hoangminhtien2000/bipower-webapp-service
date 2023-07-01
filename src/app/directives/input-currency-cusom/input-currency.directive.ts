import {Directive, ElementRef, HostListener, Input, Renderer2} from "@angular/core";
import {NG_VALUE_ACCESSOR, ControlValueAccessor, Validator, AbstractControl, ValidationErrors} from "@angular/forms";

@Directive({
    selector: "input[input-currency]",
    providers: [
        { provide: NG_VALUE_ACCESSOR, useExisting: InputCurrencyDirective, multi: true }
    ]
})
export class InputCurrencyDirective implements ControlValueAccessor, Validator {
    _renderer: Renderer2;
    _elementRef: ElementRef;
    _value: string = '';
    _count: number = 0;
    constructor(renderer: Renderer2, elementRef: ElementRef){
        this._renderer = renderer;
        this._elementRef = elementRef;
    }
    validate(control: AbstractControl): ValidationErrors {
        throw new Error("Method not implemented.");
    }
    registerOnValidatorChange?(fn: () => void): void {
        throw new Error("Method not implemented.");
    }
    @Input() maxlength = 13;
    value: any;
    @HostListener('change', ['$event.target.value']) onChange = (value) => {};
    @HostListener('blur', ['$event.target.value']) onBlur = (value) => {};
    @HostListener('keyup', ['$event.target']) onClick = (input) => { 
        this.writeValue(input.value);
    };
    onTouched = () => {};
    writeValue(value: string) {
        let newVal: string = '';
        if(value){
            value = value + '';
            if(value.length > this.maxlength/1){
                value = value.substr(0, this.maxlength/1);
            }
            value = value.replace(/,/g, "");
            value = value.replace(/\D/g, "");
            value = value.replace(/e/g, "");
            value = value.replace(/^0+/g, "");
            newVal = (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        this._renderer.setProperty(this._elementRef.nativeElement, 'value', newVal);
    }
    registerOnChange(fn: any) { this.onChange = fn; }
    registerOnTouched(fn: any) { this.onTouched = fn; this.onBlur = fn; }

    setDisabledState(isDisabled: boolean): void {
        this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
    }
}