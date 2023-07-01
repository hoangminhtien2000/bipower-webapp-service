import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2
} from '@angular/core';

@Directive({
  selector: '[appModal]'
})
export class ModalDirective implements AfterViewInit {
  @Input() modalTitle = '';
  @Input() useFullScreen = false;
  @Input() haftScreen = false;
  @Output() closed = new EventEmitter();
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit() {
    const container = this.el.nativeElement;
    const children = [];
    for (const item of container.children) {
      children.push(item);
      this.renderer.removeChild(container, item);
    }

    const box = this.renderer.createElement('div');
    this.renderer.addClass(box, 'box');
    if (this.haftScreen) {
      this.renderer.setStyle(box, 'width', '75%');
      this.renderer.setStyle(box, 'height', '100%');
    }
    const boxHeader = this.renderer.createElement('div');
    this.renderer.addClass(boxHeader, 'box-header');

    const boxTitle = this.renderer.createElement('div');
    this.renderer.addClass(boxTitle, 'box-title');
    this.renderer.addClass(boxTitle, 'history-header');

    boxTitle.innerHTML = this.modalTitle;

    const boxAction = this.renderer.createElement('div');
    this.renderer.addClass(boxAction, 'box-action');

    const collapseIcon = this.renderer.createElement('i');
    const closeIcon = this.renderer.createElement('i');
    const expandIcon = this.renderer.createElement('i');

    this.renderer.addClass(expandIcon, 'fas');
    this.renderer.setStyle(expandIcon, 'margin-right', '17px');
    this.renderer.setStyle(closeIcon, 'font-size', '18px');
    this.renderer.setStyle(closeIcon, 'color', '#707070');
    this.renderer.setStyle(expandIcon, 'font-size', '14px');
    this.renderer.setStyle(expandIcon, 'color', '#707070');
    this.renderer.setStyle(collapseIcon, 'font-size', '14px');
    this.renderer.setStyle(collapseIcon, 'color', '#707070');
    expandIcon.addEventListener('click', () => {
      this.renderer.setStyle(box, 'width', '100vw');
      this.renderer.setStyle(box, 'height', '100vh');
      this.renderer.removeChild(boxAction, expandIcon);
      this.renderer.removeChild(boxAction, closeIcon);
      this.renderer.appendChild(boxAction, collapseIcon);
      this.renderer.appendChild(boxAction, closeIcon);
    });
    this.renderer.addClass(expandIcon, 'fa-expand-arrows-alt');

    this.renderer.addClass(collapseIcon, 'fas');
    this.renderer.setStyle(collapseIcon, 'margin-right', '17px');
    collapseIcon.addEventListener('click', () => {
      this.renderer.removeStyle(box, 'width');
      this.renderer.removeStyle(box, 'height');
      this.renderer.removeChild(boxAction, collapseIcon);
      this.renderer.removeChild(boxAction, closeIcon);
      this.renderer.appendChild(boxAction, expandIcon);
      this.renderer.appendChild(boxAction, closeIcon);
    });
    this.renderer.addClass(collapseIcon, 'fa-compress-arrows-alt');

    this.renderer.addClass(closeIcon, 'fas');
    closeIcon.addEventListener('click', $event => {
      this.renderer.removeClass(container, 'show-flex');
      this.closed.emit($event);
    });
    this.renderer.addClass(closeIcon, 'fa-times');
    const boxBody = this.renderer.createElement('div');
    this.renderer.addClass(boxBody, 'box-body');

    this.renderer.appendChild(box, boxHeader);
    this.renderer.appendChild(box, boxBody);
    this.renderer.appendChild(boxHeader, boxTitle);
    this.renderer.appendChild(boxHeader, boxAction);
    if (this.useFullScreen) {
      this.renderer.appendChild(boxAction, expandIcon);
    }
    this.renderer.appendChild(boxAction, closeIcon);
    this.renderer.appendChild(container, box);

    for (const item of children) {
      this.renderer.appendChild(boxBody, item);
    }
  }
}
