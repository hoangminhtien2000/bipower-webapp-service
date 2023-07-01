import {NgxMaskModule} from "ngx-mask";
import {NgModule} from '@angular/core';
import {BipowerCurrencyPipe} from "./bipower-currency.pipe";

@NgModule({
  imports: [
    NgxMaskModule
  ],
  exports: [
    BipowerCurrencyPipe,
    NgxMaskModule
  ],
  declarations: [
    BipowerCurrencyPipe
  ],
  providers: [
  ]
})
export class BipowerMaskModule { }
