import {TranslateModule} from '@ngx-translate/core';
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {OvertimeManagementComponent} from './overtime-management/overtime-management.component';
import {CommonDirectiveModule} from "../../directives/common.directive.module";
import {SharingModule} from "../../sharing/sharing.module";
import {ContractModule} from "../contracts/contract.module";
import {TimeManagementRoutingModule} from "./time-management-routing.module";
import {
    OvertimeMangementSearchFormComponent
} from './overtime-management/overtime-mangement-search-form/overtime-mangement-search-form.component';
import {BsDatepickerConfig, BsDatepickerModule} from "ngx-bootstrap/datepicker";
import {NgbPaginationModule, NgbTimepickerModule} from "@ng-bootstrap/ng-bootstrap";
import {
    AddOrEditOtManagermentComponent
} from './overtime-management/add-or-edit-ot-managerment/add-or-edit-ot-managerment.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {MatRadioModule} from "@angular/material/radio";
import {MatButtonModule} from "@angular/material/button";
import {BsModalService} from "ngx-bootstrap/modal";
import {RejectFormComponent} from "./overtime-management/reject-form/reject-form.component";
import {ApproveFormComponent} from "./overtime-management/approve-form/approve-form.component";
import {OnleaveManagementComponent} from './onleave-management/onleave-management.component';
import {
    EditOnleaveManagementComponent
} from './onleave-management/edit-onleave-management/edit-onleave-management.component';
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {OnleaveSearchFormComponent} from './onleave-management/onleave-search-form/onleave-search-form.component';
import {ListLeaveManagementComponent} from './onleave-management/list-leave-management/list-leave-management.component';
import {
    AddOnleaveManagementComponent
} from './onleave-management/add-onleave-management/add-onleave-management.component';
import {ApprovalComponent} from './onleave-management/list-leave-management/approval/approval.component';
import {
    RefuseApprovalComponent
} from './onleave-management/list-leave-management/refuse-approval/refuse-approval.component';
import {
    ConfirmUnsubscribeComponent
} from './onleave-management/list-leave-management/confirm-unsubscribe/confirm-unsubscribe.component';
import {
    RefuseUnsubscribeComponent
} from './onleave-management/list-leave-management/refuse-unsubscribe/refuse-unsubscribe.component';
import {UnsubscribeComponent} from './onleave-management/list-leave-management/unsubscribe/unsubscribe.component';
import {
    ApprovalMultilComponent
} from './onleave-management/list-leave-management/approval-multil/approval-multil.component';
import {
    UnapprovalMultilComponent
} from './onleave-management/list-leave-management/unapproval-multil/unapproval-multil.component';
import {
    SendApprovalMultilComponent
} from './onleave-management/list-leave-management/send-approval-multil/send-approval-multil.component';
import {PresenceManagementComponent} from './presence-management/presence-management.component';
import {BreadcrumbPresenceComponent} from './presence-management/breadcrumb-presence/breadcrumb-presence.component';
import {
    TotalEmployeePresenceComponent
} from './presence-management/total-employee-presence/total-employee-presence.component';
import {CheckInCheckOutComponent} from './presence-management-employee/check-in-check-out/check-in-check-out.component';
import {HistoryComponent} from './presence-management/history/history.component';
import {FullCalendarModule} from "@fullcalendar/angular";
import {PresenceDetailComponent} from './presence-management/history/presence-detail/presence-detail.component';
import {SummaryComponent} from './presence-management/summary/summary.component';
import {
    ListEmployeeModalComponent
} from './presence-management/total-employee-presence/list-employee-modal/list-employee-modal.component';
import {
    ListEmployeeSearchFormComponent
} from './presence-management/total-employee-presence/list-employee-modal/list-employee-search-form/list-employee-search-form.component';
import {
    ListEmployeeTableshowComponent
} from './presence-management/total-employee-presence/list-employee-modal/list-employee-tableshow/list-employee-tableshow.component';
import {WorkingInformationComponent} from "./presence-management/working-information/working-information.component";
import {TooltipModule} from 'ng2-tooltip-directive';
import {UpdatePresenceComponent} from './presence-management/history/update-presence/update-presence.component';
import {CollapseModule} from "ngx-bootstrap/collapse";
import {
    ModalListOnsiteRemoteComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/modal-list-onsite-remote.component";
import {
    ModalRegisterOnsiteRemoteComponent
} from "./presence-management/presence-onsite-remote/modal-register-onsite-remote/modal-register-onsite-remote.component";
import {
    FormSearchOnsiteRemoteComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/form-search-onsite-remote/form-search-onsite-remote.component";
import {
    ListInModalOnsiteRemoteComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/list-in-modal-onsite-remote.component";
import {
    ModalUpdateOnsiteRemoteComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/modal-update-onsite-remote/modal-update-onsite-remote.component";
import {
    MemberOfTeamDetailsComponent
} from './presence-management/working-information/member-of-team-details/member-of-team-details.component';
import {
    ListCheckinCheckoutComponent
} from './presence-management/list-checkin-checkout/list-checkin-checkout.component';
import {
    ApprovalPresenceComponent
} from './presence-management/list-checkin-checkout/approval-presence/approval-presence.component';
import {
    RejectPresenceComponent
} from './presence-management/list-checkin-checkout/reject-presence/reject-presence.component';
import {
    ApprovalMultilOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/approval-multil-os/approval-multil-os.component";
import {
    UnapprovalMultilOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/unapproval-multil-os/unapproval-multil-os.component";
import {
    SendApprovalMultilOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/send-approval-multil-os/send-approval-multil-os.component";
import {PresenceComponent} from './presence-management/list-checkin-checkout/presence/presence.component';
import {RejectComponent} from './presence-management/list-checkin-checkout/presence/reject/reject.component';
import {
    ListEmployeeSummaryModalComponent
} from "./presence-management/summary/list-employee-summary-modal/list-employee-summary-modal.component";
import {
    ListEmployeeSummarySearchForm
} from "./presence-management/summary/list-employee-summary-modal/list-employee-summary-search-form/list-employee-summary-search-form";
import {
    ListEmployeeSummaryTableshowComponent
} from "./presence-management/summary/list-employee-summary-modal/list-employee-summary-tableshow/list-employee-summary-tableshow.component";
import {
    PresenceManagementEmployeeComponent
} from './presence-management-employee/presence-management-employee.component';
import {
    TotalEmployeePresenceIndividualComponent
} from './presence-management-employee/total-employee-presence-individual/total-employee-presence-individual.component';
import {MatTabsModule} from "@angular/material/tabs";
import {
    ApprovalOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/modal-update-onsite-remote/approval-os/approval-os.component";
import {
    UnapprovalOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/modal-update-onsite-remote/unapproval-os/unapproval-os.component";
import {
    SendApprovalOsComponent
} from "./presence-management/presence-onsite-remote/modal-list-onsite-remote/list-in-modal-onsite-remote/modal-update-onsite-remote/send-approval-os/send-approval-os.component";
import {NgSelect2Module} from "ng-select2";

@NgModule({
    declarations: [
        OvertimeManagementComponent,
        OvertimeMangementSearchFormComponent,
        AddOrEditOtManagermentComponent,
        RejectFormComponent,
        ApproveFormComponent,
        OnleaveManagementComponent,
        EditOnleaveManagementComponent,
        OnleaveSearchFormComponent,
        ListLeaveManagementComponent,
        AddOnleaveManagementComponent,
        ApprovalComponent,
        RefuseApprovalComponent,
        ConfirmUnsubscribeComponent,
        RefuseUnsubscribeComponent,
        UnsubscribeComponent,
        ApprovalMultilComponent,
        UnapprovalMultilComponent,
        SendApprovalMultilComponent,
        ApprovalMultilOsComponent,
        UnapprovalMultilOsComponent,
        SendApprovalMultilOsComponent,
        ApprovalOsComponent,
        UnapprovalOsComponent,
        SendApprovalOsComponent,
        PresenceManagementComponent,
        BreadcrumbPresenceComponent,
        TotalEmployeePresenceComponent,
        CheckInCheckOutComponent,
        HistoryComponent,
        PresenceDetailComponent,
        SummaryComponent,
        ListEmployeeModalComponent,
        ListEmployeeSearchFormComponent,
        ListEmployeeTableshowComponent,
        ListEmployeeSummaryModalComponent,
        ListEmployeeSummarySearchForm,
        ListEmployeeSummaryTableshowComponent,
        WorkingInformationComponent,
        UpdatePresenceComponent,
        ModalListOnsiteRemoteComponent,
        ModalRegisterOnsiteRemoteComponent,
        ModalUpdateOnsiteRemoteComponent,
        FormSearchOnsiteRemoteComponent,
        ListInModalOnsiteRemoteComponent,
        MemberOfTeamDetailsComponent,
        ListCheckinCheckoutComponent,
        ApprovalPresenceComponent,
        RejectPresenceComponent,
        PresenceComponent,
        RejectComponent,
        PresenceManagementEmployeeComponent,
        TotalEmployeePresenceIndividualComponent,
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        CommonDirectiveModule,
        SharingModule,
        ContractModule,
        TimeManagementRoutingModule,
        BsDatepickerModule.forRoot(),
        NgbPaginationModule,
        MatDialogModule,
        MatInputModule,
        MatRadioModule,
        MatButtonModule,
        NgxDaterangepickerMd.forRoot(),
        TranslateModule,
        FullCalendarModule,
        TooltipModule,
        CollapseModule,
        MatTabsModule,
        NgSelect2Module,
        NgbTimepickerModule
    ],
    exports: [
        WorkingInformationComponent
    ],
    providers: [BsDatepickerConfig, BsModalService]
})

export class TimeManagementModule {
}
