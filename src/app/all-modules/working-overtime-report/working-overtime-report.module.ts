import { TranslateModule } from '@ngx-translate/core';
import {CommonDirectiveModule} from 'src/app/directives/common.directive.module';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DataTablesModule} from "angular-datatables";
import {WorkingOvertimeReportListComponent} from './working-overtime-report-list/working-overtime-report-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ContractService} from 'src/app/core/services/contract.service';
import { SharingModule } from 'src/app/sharing/sharing.module';
import { CustomFormatDate } from 'src/assets/pipes/custom-format-date.pipe';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { WorkingOvertimeReportRoutingModule } from './working-overtime-report-routing.module';
import { WorkingOvertimeReportComponent } from './working-overtime-report.component';

@NgModule({
  declarations: [WorkingOvertimeReportComponent, WorkingOvertimeReportListComponent],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    NgbPaginationModule, NgbAlertModule,
    BsDatepickerModule.forRoot(),
    WorkingOvertimeReportRoutingModule,
    SharingModule,
    TranslateModule
  ],
  exports: [
    
  ],
  providers: [BsDatepickerConfig, ContractService, DatePipe, CustomFormatDate]
})
export class WorkingOvertimeReportModule { }
