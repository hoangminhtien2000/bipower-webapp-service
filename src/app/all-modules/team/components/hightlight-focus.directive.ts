import {Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appHightlightFocus]'
})
export class HightlightFocusDirective implements OnInit{

  constructor(private elementRef: ElementRef<any>) { }

  ngOnInit() {
    const nativeElement = this.elementRef.nativeElement as HTMLElement;
  }

}
