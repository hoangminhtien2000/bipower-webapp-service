/** dependencies */
import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormlyModule} from '@ngx-formly/core';
import {FormlyBootstrapModule} from '@ngx-formly/bootstrap';
import {TextMaskModule} from 'angular2-text-mask';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {PopoverModule} from 'ngx-bootstrap/popover';
import {ProgressbarModule} from 'ngx-bootstrap/progressbar';
import {TimepickerModule} from 'ngx-bootstrap/timepicker';

/** wrappers */
/** types */
import {MultiSelectModule} from 'primeng/multiselect';


import {defineLocale, LocaleData} from 'ngx-bootstrap/chronos';
/** configuration */
import {config} from './config'


import {InputFormlyTypeComponent} from './types/input-formly-type/input-formly-type.component';
// tslint:disable-next-line: nx-enforce-module-boundaries
// import { NgxTabsComponent } from 'apps/web/src/app/ngx/component/layout/tabs/ngx-tabs.component';
// tslint:disable-next-line: nx-enforce-module-boundaries
// import { NgxTabComponent } from 'apps/web/src/app/ngx/component/layout/tabs/tab/ngx-tab.component';
import {ModalDirective} from '../directives/modal.directive';
import {ValidationLoaderFormlyService} from './services/validation-loader-formly.service';
import {RemoveWrapperDirective} from '../directives/remove-wrapper.directive';
import {TypeAheadComponent} from './types/type-ahead/type-ahead.component';
import {NgbAlertModule, NgbDropdownModule, NgbModule, NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import {NgxMaskModule} from 'ngx-mask';
import {BipowerMaskModule} from "../bipower-mask/bipower-mask.module";
import {DateFormlyTypeComponent} from "./types/date-formly-type/date-formly-type.component";
import {DateFromToFormlyTypeComponent} from "./types/date-from-to-formly-type/date-from-to-formly-type.component";
import {SelectFormlyTypeComponent} from "./types/select-formly-type/select-formly-type.component";
import {MultiselectFormlyTypeComponent} from "./types/multiselect-formly-type/multiselect-formly-type.component";
import {MonthFormlyTypeComponent} from "./types/month-formly-type/month-formly-type.component";
import {YearFormlyTypeComponent} from "./types/year-formly-type/year-formly-type.component";
import {TitleFormlyTypeComponent} from "./types/title-formly-type/title-formly-type.component";
import {TextareaFormlyTypeComponent} from "./types/textarea-formly-type/textarea-formly-type.component";
import {TranslateModule} from "@ngx-translate/core";
import {NgSelectModule} from "@ng-select/ng-select";
import {InterceptorModule} from "../../../../app/intercepter.module";
import {AutocompleteFormlyTypeComponent} from "./types/autocomplete-formly-type/autocomplete-formly-type.component";
import {DaterangeFormlyTypeComponent} from "./types/daterange-formly-type/daterange-formly-type.component";
import {IconDeleteFormlyTypeComponent} from "./types/icon-delete-formly-type/icon-delete-formly-type.component";
import {RadioFormlyTypeComponent} from "./types/radio-formly-type/radio-formly-type.component";
import {HourRangeFromlyTypeComponent} from "./types/hour-range-fromly-type/hour-range-fromly-type.component";
import {CalendarModule} from "primeng/calendar";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {CurrencyInputFormlyTypeComponent} from "./types/currency-input-formly-type/currency-input-formly-type.component";
import {InputNumberModule} from "primeng/inputnumber";
import {SharingModule} from "../../../../app/sharing/sharing.module";
import {CurrencyFormlyTypeComponent} from "./types/currency-formly-type/currency-formly-type.component";
import {MultiselectFormlyShortTypeComponent} from './types/multiselect-formly-short-type/multiselect-formly-short-type.component';
import {ChipSelectItemDirective1} from './types/multiselect-formly-short-type/chip-select-item.directive';

const viLocale: LocaleData = {
  abbr: 'vi',
  months: 'Tháng 1_Tháng 2_Tháng 3_Tháng 4_Tháng 5_Tháng 6_Tháng 7_Tháng 8_Tháng 9_Tháng 10_Tháng 11_Tháng 12'.split('_'),
  monthsShort: 'Th01_Th02_Th03_Th04_Th05_Th06_Th07_Th08_Th09_Th10_Th11_Th12'.split('_'),
  monthsParseExact: true,
  weekdays: 'Chủ nhật_Thứ hai_Thứ ba_Thứ tư_Thứ năm_Thứ sáu_Thứ bảy'.split('_'),
  weekdaysShort: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysMin: 'CN_T2_T3_T4_T5_T6_T7'.split('_'),
  weekdaysParseExact: true,
  meridiemParse: /sa|ch/i,
  isPM(input: string): boolean {
    return /^ch$/i.test(input);
  },
  meridiem(hours: number, minutes: number, isLower: boolean): string {
    if (hours < 12) {
      return isLower ? 'sa' : 'SA';
    } else {
      return isLower ? 'ch' : 'CH';
    }
  },
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM [năm] YYYY',
    LLL: 'D MMMM [năm] YYYY HH:mm',
    LLLL: 'dddd, D MMMM [năm] YYYY HH:mm',
    l: 'DD/M/YYYY',
    ll: 'D MMM YYYY',
    lll: 'D MMM YYYY HH:mm',
    llll: 'ddd, D MMM YYYY HH:mm'
  },
  calendar: {
    sameDay: '[Hôm nay lúc] LT',
    nextDay: '[Ngày mai lúc] LT',
    nextWeek: 'dddd [tuần tới lúc] LT',
    lastDay: '[Hôm qua lúc] LT',
    lastWeek: 'dddd [tuần trước lúc] LT',
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s tới',
    past: '%s trước',
    s: 'vài giây',
    ss: '%d giây',
    m: 'một phút',
    mm: '%d phút',
    h: 'một giờ',
    hh: '%d giờ',
    d: 'một ngày',
    dd: '%d ngày',
    M: 'một tháng',
    MM: '%d tháng',
    y: 'một năm',
    yy: '%d năm'
  },
  dayOfMonthOrdinalParse: /\d{1,2}/,
  ordinal(_num: number): string {
    return '' + _num;
  },
  week: {
    dow: 1, // Thứ Hai là ngày đầu tuần.
    doy: 4  // Tuần chứa ngày 4 tháng 1 là tuần đầu tiên trong năm.
  }
};

defineLocale('vi', viLocale);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(config),
    FormlyBootstrapModule,
    TextMaskModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    NgxMaskModule,
    MultiSelectModule,
    NgbDropdownModule,
    NgSelectModule,
    NgbModule,
    BipowerMaskModule,
    NgbPaginationModule,
    NgbAlertModule,
    TranslateModule,
    InterceptorModule.forRoot(),
    CalendarModule,
    OverlayPanelModule,
    InputNumberModule,
    SharingModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FormlyModule,
    FormlyBootstrapModule,
    ModalDirective,
    RemoveWrapperDirective,
    // NgxTabsComponent,
    // NgxTabComponent,

    InputFormlyTypeComponent,
    HourRangeFromlyTypeComponent,
    DateFormlyTypeComponent,
    MonthFormlyTypeComponent,
    YearFormlyTypeComponent,
    DateFromToFormlyTypeComponent,
    SelectFormlyTypeComponent,
    MultiselectFormlyTypeComponent,
    TextareaFormlyTypeComponent,
    TitleFormlyTypeComponent,
    AutocompleteFormlyTypeComponent,
    DaterangeFormlyTypeComponent,
    IconDeleteFormlyTypeComponent,
    RadioFormlyTypeComponent,
    CurrencyInputFormlyTypeComponent,
    NgbModule,
    NgSelectModule
  ],
  declarations: [
    ModalDirective,
    RemoveWrapperDirective,
    InputFormlyTypeComponent,
    HourRangeFromlyTypeComponent,
    DateFormlyTypeComponent,
    MonthFormlyTypeComponent,
    YearFormlyTypeComponent,
    DateFromToFormlyTypeComponent,
    SelectFormlyTypeComponent,
    MultiselectFormlyTypeComponent,
    TitleFormlyTypeComponent,
    TextareaFormlyTypeComponent,
    AutocompleteFormlyTypeComponent,
    DaterangeFormlyTypeComponent,
    IconDeleteFormlyTypeComponent,
    RadioFormlyTypeComponent,
    CurrencyInputFormlyTypeComponent,
    TypeAheadComponent,
    CurrencyFormlyTypeComponent,
    MultiselectFormlyShortTypeComponent,
    ChipSelectItemDirective1
  ],
  providers: [ValidationLoaderFormlyService]
})
export class UiFormModule { }
