import { Directive, ElementRef } from '@angular/core';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[remove-wrapper]'
})
export class RemoveWrapperDirective {

  elf: ElementRef;

  constructor(private el: ElementRef) {
    this.elf = el;
  }

  removeParentTag() {
    const parentE = this.elf.nativeElement.parentElement;
    const element = this.elf.nativeElement;
    parentE.removeChild(element);
    parentE.parentNode.insertBefore(element, parentE.nextSibling);
    parentE.parentNode.removeChild(parentE);
  }

  removeFormlyFormTag() {
    const parentE = this.elf.nativeElement.parentElement;
    if (parentE.parentNode && parentE.children) {
      const array = Array.from(parentE.children);
      array.slice().reverse().forEach(elm => {
        parentE.removeChild(elm);
        parentE.parentNode.insertBefore(elm, parentE.nextSibling);
      });
      parentE.parentNode.removeChild(parentE);
    }
  }

  removeFormlyFieldTag() {
    const element = this.elf.nativeElement;
    let parentE = element.parentElement;
    while (parentE.tagName !== "FORMLY-FIELD") {
      parentE = parentE.parentElement;
    }
    if (parentE.parentNode && parentE.children) {
      const array = Array.from(parentE.children);
      array.slice().reverse().forEach(elm => {
        parentE.removeChild(elm);
        parentE.parentNode.insertBefore(elm, parentE.nextSibling);
      });
      parentE.parentNode.removeChild(parentE);
    }
  }

}
