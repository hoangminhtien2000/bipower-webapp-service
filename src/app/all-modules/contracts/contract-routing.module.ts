import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractComponent } from './contract.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractFormComponent } from './contract-form/contract-form.component';

const routes: Routes = [
  {
    path:"",
    component: ContractComponent,
    children:[
     {
       path: 'contractform',
       component: ContractFormComponent
     },
     {
       path: 'contractlist',
       component: ContractListComponent
     }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ContractRoutingModule { }
