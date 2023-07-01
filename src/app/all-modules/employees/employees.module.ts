import { TranslateModule } from '@ngx-translate/core';
import { FamilyInformationModalComponent } from './all-employees/employee-profile/family-information-modal/family-information-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {EmployeesRoutingModule} from './employees-routing.module';
import {EmployeesComponent} from './employees.component';
import {AllEmployeesComponent} from './all-employees/all-employees.component';
import {EmployeePageContentComponent} from './all-employees/employee-page-content/employee-page-content.component';
import {EmployeeListComponent} from './all-employees/employee-list/employee-list.component';
import {EmployeeProfileComponent} from './all-employees/employee-profile/employee-profile.component';
import {HolidaysComponent} from './holidays/holidays.component';
import {LeavesAdminComponent} from './leaves-admin/leaves-admin.component';
import {LeavesEmployeeComponent} from './leaves-employee/leaves-employee.component';
import {LeaveSettingsComponent} from './leave-settings/leave-settings.component';
import {AttendanceAdminComponent} from './attendance-admin/attendance-admin.component';
import {AttendanceEmployeeComponent} from './attendance-employee/attendance-employee.component';
import {DepartmentsComponent} from './departments/departments.component';
import {DesignationComponent} from './designation/designation.component';
import {TimesheetComponent} from './timesheet/timesheet.component';
import {OvertimeComponent} from './overtime/overtime.component';
import {DataTablesModule} from 'angular-datatables';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BsDatepickerConfig, BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SharingModule} from 'src/app/sharing/sharing.module';
import {PickListModule} from 'primeng/picklist';
import {DatePipe} from '@angular/common';
import {EmployeeSearchFormComponent} from './all-employees/employee-search-form/employee-search-form.component';
import {EmployeeModalComponent} from './all-employees/employee-modal/employee-modal.component';
import {CommonDirectiveModule} from 'src/app/directives/common.directive.module';
import {EmployeeService} from 'src/app/core/services/employee.service';
import {
    BankInformationModalComponent
} from './all-employees/employee-profile/bank-information-modal/bank-information-modal.component';
import {
    IdentityInformationModalComponent
} from './all-employees/employee-profile/identity-information-modal/identity-information-modal.component';
import {
    PersonalTaxInformationModalComponent
} from './all-employees/employee-profile/personal-tax-information-modal/personal-tax-information-modal.component';
import {
    SocialInsuranceInformationModalComponent
} from './all-employees/employee-profile/social-insurance-information-modal/social-insurance-information-modal.component';
import {MyProfileComponent} from "./all-employees/my-profile/my-profile.component";
import {
    StorageProfileModalComponent
} from './all-employees/employee-profile/storage-profile-modal/storage-profile-modal.component';
import {MultiSelectModule} from 'primeng/multiselect';
import {DropdownModule} from 'primeng/dropdown';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {
    AddressInformationModalComponent
} from './all-employees/employee-profile/address-information-modal/address-information-modal.component';
import {EmployeeModalViewComponent} from './all-employees/employee-modal-view/employee-modal-view.component';
import {NgbAlertModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {ContractModule} from '../contracts/contract.module';
import {EmployeeImportComponent} from './employee-import/employee-import.component';
import {NgxFileDropModule} from "ngx-file-drop";
import {BsModalService} from "ngx-bootstrap/modal";
import { EmployeeConfirmApproveModalComponent } from './all-employees/employee-profile/confirm-approve-modal/employee-confirm-approve-modal.component';
import { TeamRoleModalComponent } from './all-employees/employee-profile/team-role-modal/team-role-modal.component';
import { PerformanceInfoModalComponent } from './all-employees/employee-profile/performance-info-modal/performance-info-modal.component';
import { SocialInsuranceHistoryModalComponent } from './all-employees/employee-profile/social-insurance-history-modal/social-insurance-history-modal.component';
import { PersonalTaxInformationHistoryModalComponent } from './all-employees/employee-profile/personal-tax-information-history-modal/personal-tax-information-history-modal.component';
import { PerformanceHistoryModalComponent } from './all-employees/employee-profile/performance-history-modal/performance-history-modal.component';

@NgModule({
    declarations: [EmployeesComponent, AllEmployeesComponent, EmployeePageContentComponent, EmployeeListComponent,
        EmployeeProfileComponent, MyProfileComponent, HolidaysComponent, LeavesAdminComponent, LeavesEmployeeComponent,
        LeaveSettingsComponent, AttendanceAdminComponent, AttendanceEmployeeComponent, DepartmentsComponent,
        DesignationComponent, TimesheetComponent, OvertimeComponent, EmployeeSearchFormComponent,
        EmployeeModalComponent, BankInformationModalComponent, IdentityInformationModalComponent,
        PersonalTaxInformationModalComponent, SocialInsuranceInformationModalComponent,
         FamilyInformationModalComponent,
        StorageProfileModalComponent, AddressInformationModalComponent, EmployeeModalViewComponent,
        EmployeeImportComponent, EmployeeConfirmApproveModalComponent, TeamRoleModalComponent,
        PerformanceInfoModalComponent, 
        SocialInsuranceHistoryModalComponent, PersonalTaxInformationHistoryModalComponent, PerformanceHistoryModalComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PickListModule,
        EmployeesRoutingModule,
        BsDatepickerModule.forRoot(),
        DataTablesModule,
        CommonDirectiveModule,
        MultiSelectModule,
        DropdownModule,
        AutoCompleteModule,
        NgbPaginationModule, NgbAlertModule,
        SharingModule,
        ContractModule,
        TranslateModule,
        NgxFileDropModule
    ],
    // entryComponents: [BankInformationModalComponent],
    providers: [DatePipe, BsDatepickerConfig, EmployeeService, BsModalService]
})

export class EmployeesModule {
}
