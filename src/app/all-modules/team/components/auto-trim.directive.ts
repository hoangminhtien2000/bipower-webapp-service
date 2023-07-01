import {Directive, HostListener, OnInit} from '@angular/core';
import {NgControl} from "@angular/forms";

@Directive({
  selector: '[appAutoTrim]'
})
export class AutoTrimDirective implements OnInit{

  constructor(private control: NgControl) { }

  ngOnInit() {
  }

  @HostListener('blur')
  autoTrim(): void {
    const value = this.control.value;
    if (value && typeof value === 'string') {
      this.control.control.patchValue(value.trim());
    }
  }

}
