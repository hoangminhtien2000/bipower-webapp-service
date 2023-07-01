import { NgModule } from '@angular/core';
import { InputCurrencyDirective } from './input-currency-cusom/input-currency.directive';
import { MultipleFileUpload } from './single-file-upload/multiple-file-upload.directive';
import { SingleFileUpload } from './single-file-upload/single-file-upload.directive';

@NgModule({
  declarations: [SingleFileUpload, MultipleFileUpload, InputCurrencyDirective],
  imports: [],
  exports: [SingleFileUpload, MultipleFileUpload, InputCurrencyDirective],
  providers: []
})
export class CommonDirectiveModule { }