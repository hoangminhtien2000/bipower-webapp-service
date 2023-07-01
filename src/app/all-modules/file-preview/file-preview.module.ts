import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilePreviewComponent } from './file-preview.component';
import { FilePreviewRoutingModule } from './file-preview-routing.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [FilePreviewComponent],
  imports: [
    CommonModule,
    FilePreviewRoutingModule,
    ReactiveFormsModule,
    FormsModule,
     DataTablesModule,
     PdfViewerModule
  ]
})
export class FilePreviewModule { }
