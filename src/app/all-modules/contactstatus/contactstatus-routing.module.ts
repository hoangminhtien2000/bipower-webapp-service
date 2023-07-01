import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactstatusComponent } from './contactstatus.component';
import { ContactstatusListComponent } from './contactstatus-list/contactstatus-list.component';

const routes: Routes = [
  {
    path:"",
    component:ContactstatusComponent,
    children:[
     {
      path:"contact-status",
      component:ContactstatusListComponent
     }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContactstatusRoutingModule { }
