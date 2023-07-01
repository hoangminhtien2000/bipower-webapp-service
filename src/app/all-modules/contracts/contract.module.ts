import { TranslateModule } from '@ngx-translate/core';
import {CommonDirectiveModule} from 'src/app/directives/common.directive.module';
import {ContractModalComponent} from './contract-modal/contract-modal.component';
import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {DataTablesModule} from "angular-datatables";
import {ContractRoutingModule} from './contract-routing.module';
import {ContractComponent} from './contract.component';
import {ContractListComponent} from './contract-list/contract-list.component';
import {ContractFormComponent} from './contract-form/contract-form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {ContractService} from 'src/app/core/services/contract.service';
import { SharingModule } from 'src/app/sharing/sharing.module';
import { CustomFormatDate } from 'src/assets/pipes/custom-format-date.pipe';
import { NgbAlertModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from 'primeng/dropdown';

@NgModule({
  declarations: [ContractComponent, ContractListComponent, ContractFormComponent, ContractModalComponent],
  imports: [
    CommonModule,
    ContractRoutingModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    CommonDirectiveModule,
    BsDatepickerModule.forRoot(),
    NgbPaginationModule, NgbAlertModule,
    DropdownModule,
    SharingModule,
    TranslateModule.forChild()
  ],
  exports: [
    ContractModalComponent
  ],
  providers: [BsDatepickerConfig, ContractService, DatePipe, CustomFormatDate]
})
export class ContractModule { }
