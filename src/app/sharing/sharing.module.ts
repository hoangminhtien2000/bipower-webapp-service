import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {CustomDatePipe} from 'src/assets/pipes/custom-date.pipe';
import {CustomCurrencyPipe} from 'src/assets/pipes/custom-currency.pipe';
import {CustomYearWorkingPipe} from 'src/assets/pipes/custom-year-working.pipe';
import {CustomSubstrPipe} from 'src/assets/pipes/custom-substr.pipe';
import {CustomFormatDate} from 'src/assets/pipes/custom-format-date.pipe';
import {TaPaginatorComponent} from "./ta-paginator/ta-paginator.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {CommonDialogComponent} from "./common-dialog/common-dialog.component";
import {DaterangepickerComponent} from './daterangepicker/daterangepicker.component';
import {NgxDaterangepickerMd} from "ngx-daterangepicker-material";
import {ControlErrorMessageComponent} from './control-error-message/control-error-message.component';
import {LoadingComponent} from './loading/loading.component';
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {UpperFirstPipe} from "./upper-first.pipe";
import {CalendarModule} from "primeng/calendar";
import {InputTextModule} from "primeng/inputtext";
import {OverlayPanelModule} from "primeng/overlaypanel";
import { TimeRangeComponent } from './time-range/time-range.component';
import { TimePickerComponent } from './time-picker/time-picker.component';
import { CurencyFormatDirective } from './curency-format.directive';



@NgModule({
  declarations: [
    CustomDatePipe,
    CustomCurrencyPipe,
    CustomYearWorkingPipe,
    CustomSubstrPipe,
    CustomFormatDate,
    UpperFirstPipe,
    TaPaginatorComponent,
    CommonDialogComponent,
    DaterangepickerComponent,
    CommonDialogComponent,
    ControlErrorMessageComponent,
    LoadingComponent,
    TimeRangeComponent,
    TimePickerComponent,
    CurencyFormatDirective
  ],
    exports: [
        CustomDatePipe,
        CustomDatePipe,
        CustomCurrencyPipe,
        CustomYearWorkingPipe,
        CustomSubstrPipe,
        CustomFormatDate,
        UpperFirstPipe,
        TaPaginatorComponent,
        CommonDialogComponent,
        DaterangepickerComponent,
        ControlErrorMessageComponent,
        LoadingComponent,
        TimeRangeComponent,
        CurencyFormatDirective
    ],
    imports: [
        CommonModule, NgbModule, FormsModule, TranslateModule, NgxDaterangepickerMd, CalendarModule, InputTextModule, OverlayPanelModule, ReactiveFormsModule
    ],
  entryComponents: [
    TaPaginatorComponent, CommonDialogComponent
  ],
    providers: [DecimalPipe],
  bootstrap: [TaPaginatorComponent]
})
export class SharingModule { }
