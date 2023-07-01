import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {OvertimeManagementComponent} from "./overtime-management/overtime-management.component";
import {TimemanagementComponent} from "./timemanagement.component";
import {OnleaveManagementComponent} from "./onleave-management/onleave-management.component";
import {PresenceManagementComponent} from "./presence-management/presence-management.component";
import {HistoryComponent} from "./presence-management/history/history.component";
import {SummaryComponent} from "./presence-management/summary/summary.component";
import {
    PresenceManagementEmployeeComponent
} from "./presence-management-employee/presence-management-employee.component";

const routes: Routes = [{
    path: '',
    component: TimemanagementComponent,
    children: [{
        path: 'overtimemanagement',
        component: OvertimeManagementComponent
    },
        {
            path: 'onleavemanagement',
            component: OnleaveManagementComponent
        },
        {
            path: 'presencemanagement',
            component: PresenceManagementComponent,
        },
        {
            path: 'presencemanagement/summary',
            component: SummaryComponent,
        },
        {
            path: 'presencemanagement/history',
            component: HistoryComponent,
        }
    ]
}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class TimeManagementRoutingModule {
}
