import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {COMMON} from "../../core/common/constant";

@Component({
  selector: 'app-ta-paginator',
  templateUrl: './ta-paginator.component.html',
  styleUrls: ['./ta-paginator.component.scss']
})
export class TaPaginatorComponent implements OnInit {
  @Input() page;
  @Input() pageSize;
  @Input() totalElements;
  @Input() pageSizeOptions: any;

  @Output() onPageChange = new EventEmitter();
  @Output() onPageSizeChange = new EventEmitter();
  constanCommon = COMMON;

  constructor() {
  }

  ngOnInit() {

  }

  changePageSize(value: any) {
    this.onPageSizeChange.emit(value);
  }

  pageChange(event) {
    this.onPageChange.emit(event);
  }
}
