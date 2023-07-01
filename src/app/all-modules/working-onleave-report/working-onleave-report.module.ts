import { TranslateModule } from '@ngx-translate/core';
import {CommonDirectiveModule} from 'src/app/directives/common.directive.module';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DataTablesModule} from "angular-datatables";
import {WorkingOnleaveReportListComponent} from './working-onleave-report-list/working-onleave-report-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ContractService} from 'src/app/core/services/contract.service';
import { SharingModule } from 'src/app/sharing/sharing.module';
import { CustomFormatDate } from 'src/assets/pipes/custom-format-date.pipe';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkingOnleaveReportRoutingModule } from './working-onleave-report-routing.module';
import { WorkingOnleaveReportComponent } from './working-onleave-report.component';

@NgModule({
  declarations: [WorkingOnleaveReportComponent, WorkingOnleaveReportListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule, NgbAlertModule,
    BsDatepickerModule.forRoot(),
    WorkingOnleaveReportRoutingModule,
    SharingModule,
    TranslateModule
  ],
  exports: [
    
  ],
  providers: [BsDatepickerConfig, ContractService, DatePipe, CustomFormatDate]
})
export class WorkingOnleaveReportModule { }
