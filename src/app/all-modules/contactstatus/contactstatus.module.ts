import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from "angular-datatables";
import { ContactstatusRoutingModule } from './contactstatus-routing.module';
import { ContactstatusComponent } from './contactstatus.component';
import { ContactstatusListComponent } from './contactstatus-list/contactstatus-list.component';


@NgModule({
  declarations: [ContactstatusComponent, ContactstatusListComponent],
  imports: [
    CommonModule,
    ContactstatusRoutingModule,
    DataTablesModule,
  ]
})
export class ContactstatusModule { }
