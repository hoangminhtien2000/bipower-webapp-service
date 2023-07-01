import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-control-error-message',
  templateUrl: './control-error-message.component.html',
  styleUrls: ['./control-error-message.component.css']
})
export class ControlErrorMessageComponent implements OnInit, OnChanges {

  @Input() errors: any;
  @Input() field: string = '';
  @Input() showError = false;

  convertError: {key: string; params: any}[];

  maxLength = 0;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['errors'] && this.errors) {
      this.maxLength = this.errors.maxlength?.requiredLength;
      this.convertError = Object.keys(this.errors).reduce((result,field) => {
        return [...result, {
          key: `validations.controlMessage.${field}`,
          params: {
            ...this.errors[field]
          }
        }]
      }, []);
    }
  }

}
