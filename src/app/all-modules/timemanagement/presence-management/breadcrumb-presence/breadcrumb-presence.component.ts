import { Component, OnInit } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-breadcrumb-presence',
  templateUrl: './breadcrumb-presence.component.html',
  styleUrls: ['./breadcrumb-presence.component.css']
})
export class BreadcrumbPresenceComponent implements OnInit {

  constructor(private translate: TranslateService) { }

  ngOnInit(): void {
  }

}
