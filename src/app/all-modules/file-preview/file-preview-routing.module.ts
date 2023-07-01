import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilePreviewComponent } from './file-preview.component';

const routes: Routes = [
  {
    path:"",
    component: FilePreviewComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilePreviewRoutingModule { }
