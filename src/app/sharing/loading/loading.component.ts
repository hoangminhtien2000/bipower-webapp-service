import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent implements OnInit {

  @Input() loading = false;
  @Input() zIndex = 1000;

  constructor() { }

  ngOnInit(): void {
  }

}
