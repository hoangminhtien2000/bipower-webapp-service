import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ListTeamComponent} from "./containers/list-team/list-team.component";
import {TeamInfoComponent} from "./containers/team-info/team-info.component";
import {TeamContainerComponent} from "./team-container.component";
import {ExitOnchangeGuard} from "./components/exit-onchange.guard";
import {requiredRolesField} from "../../core/guards/pass-role.guard";
import {CONFIG} from "../../core/config/application.config";

const routes: Routes = [
  {
    path: '',
    component: TeamContainerComponent,
    children: [
      {
        path: '',
        component: ListTeamComponent,
        // canActivate: [PassRoleGuard],
        data: {
          [requiredRolesField]: CONFIG.PERMISSION.ACTION.SEARCH_TEAM
        }
      },
      {
        path: ':id',
        component: TeamInfoComponent,
        canDeactivate: [ExitOnchangeGuard],
        // canActivate: [PassRoleGuard],
        // data: {
        //   [requiredRolesField]: CONFIG.PERMISSION.ACTION.EDIT_TEAM
        // }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeamRoutingModule { }
