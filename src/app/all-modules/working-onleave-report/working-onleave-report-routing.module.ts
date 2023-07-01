import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkingOnleaveReportListComponent } from './working-onleave-report-list/working-onleave-report-list.component';
import { WorkingOnleaveReportComponent } from './working-onleave-report.component';

const routes: Routes = [
  {
    path:"",
    component: WorkingOnleaveReportComponent,
    children:[
     {
       path: 'list',
       component: WorkingOnleaveReportListComponent
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class WorkingOnleaveReportRoutingModule { }
