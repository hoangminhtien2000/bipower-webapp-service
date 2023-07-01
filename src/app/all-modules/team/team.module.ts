import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TeamRoutingModule} from './team-routing.module';
import {ListTeamComponent} from './containers/list-team/list-team.component';
import {TeamInfoComponent} from './containers/team-info/team-info.component';
import {TeamContainerComponent} from './team-container.component';
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {DataTablesModule} from "angular-datatables";
import {TeamFilterComponent} from './components/team-filter/team-filter.component';
import {TeamTableComponent} from './components/team-table/team-table.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {CreateTeamDialogComponent} from './components/create-team-dialog/create-team-dialog.component';
import {DialogModule} from "primeng/dialog";
import {DynamicDialogModule} from "primeng/dynamicdialog";
import {TeamChangeHistoryComponent} from './components/team-change-history/team-change-history.component';
import {MultiSelectModule} from "primeng/multiselect";
import {InputTextareaModule} from "primeng/inputtextarea";
import {SharingModule} from "../../sharing/sharing.module";
import {CalendarModule} from "primeng/calendar";
import {EmployeeTableComponent} from './components/employee-table/employee-table.component';
import {EmployeeInfoDialogComponent} from './components/employee-info-dialog/employee-info-dialog.component';
import {ChipSelectItemDirective} from './components/chip-select-item.directive';
import {TranslateModule} from "@ngx-translate/core";
import {CreateItemDialogComponent} from './components/create-item-dialog/create-item-dialog.component';
import {InputNumberModule} from "primeng/inputnumber";
import {ExitOnchangeGuard} from "./components/exit-onchange.guard";
import { ConfirmExitPageComponent } from './components/confirm-exit-page/confirm-exit-page.component';
import {CheckboxModule} from "primeng/checkbox";
import { RangePipe } from './components/range.pipe';
import {TooltipModule} from "primeng/tooltip";
import {RadioButtonModule} from "primeng/radiobutton";
import { ConfirmSaveDialogComponent } from './components/confirm-save-dialog/confirm-save-dialog.component';
import { AutoTrimDirective } from './components/auto-trim.directive';
import {AutoCompleteModule} from "primeng/autocomplete";
import { HightlightFocusDirective } from './components/hightlight-focus.directive';
import {ModalModule} from "ngx-bootstrap/modal";
import { ConfirmDeleteTeamComponent } from './components/confirm-delete-team/confirm-delete-team.component';


@NgModule({
    declarations: [
        ListTeamComponent,
        TeamInfoComponent,
        TeamContainerComponent,
        TeamFilterComponent,
        TeamTableComponent,
        CreateTeamDialogComponent,
        TeamChangeHistoryComponent,
        EmployeeTableComponent,
        EmployeeInfoDialogComponent,
        ChipSelectItemDirective,
        CreateItemDialogComponent,
        ConfirmExitPageComponent,
        RangePipe,
        ConfirmSaveDialogComponent,
        AutoTrimDirective,
        HightlightFocusDirective,
        ConfirmDeleteTeamComponent,
    ],
    imports: [
        CommonModule,
        TeamRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        NgbPaginationModule,
        InputTextModule,
        MultiSelectModule,
        CalendarModule,
        DropdownModule,
        InputTextareaModule,
        SharingModule,
        DialogModule,
        DynamicDialogModule,
        DropdownModule,
        DataTablesModule,
        InputNumberModule,
        CheckboxModule,
        TooltipModule,
        RadioButtonModule,
        AutoCompleteModule,
        ModalModule.forChild()
    ],
})
export class TeamModule {
}
