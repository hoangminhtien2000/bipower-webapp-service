import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkingOvertimeReportListComponent } from './working-overtime-report-list/working-overtime-report-list.component';
import { WorkingOvertimeReportComponent } from './working-overtime-report.component';

const routes: Routes = [
  {
    path:"",
    component: WorkingOvertimeReportComponent,
    children:[
     {
       path: 'list',
       component: WorkingOvertimeReportListComponent
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WorkingOvertimeReportRoutingModule { }
