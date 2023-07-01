//import { InputSearchSingleSerialTypeComponent } from './types/input-search-single-serial/input-search-single-serial-type.component';
import {
  maxValidationMessage,
  minValidationMessage,
  toDateRangeValidationMsg,
  fromDateRangeValidationMsg, maxMoneyValidationMessage, minMoneyValidationMessage
} from './helpers/validations-messages';
import { maximumMoneyValidator } from './helpers/validators';
import { minimumMoneyValidator } from './helpers/validators';
import { ConfigOption } from "@ngx-formly/core";


// import { ButtonFormlyTypeComponent } from './types/button-formly-type/button-formly-type.component';
import { RadioFormlyTypeComponent } from './types/radio-formly-type/radio-formly-type.component';
// import { CheckboxFormlyTypeComponent } from './types/checkbox-formly-type/checkbox-formly-type.component';
import { DateFormlyTypeComponent } from './types/date-formly-type/date-formly-type.component';
import { SelectFormlyTypeComponent } from './types/select-formly-type/select-formly-type.component';
// import { TagFormlyTypeComponent } from './types/tag-formly-type/tag-formly-type.component';
// import { RepeatTableFormlyTypeComponent } from './types/repeat-table-formly-type/repeat-table-formly-type.component';
// import { RepeatSectionFormlyTypeComponent } from './types/repeat-section-formly-type/repeat-section-formly-type.component';
// import { PercentageFormlyTypeComponent } from './types/percentage-formly-type/percentage-formly-type.component';
// import { MoneyFormlyTypeComponent } from './types/money-formly-type/money-formly-type.component';
import { MultiselectFormlyTypeComponent } from './types/multiselect-formly-type/multiselect-formly-type.component';
// import { TableFormlyTypeComponent } from './types/table-formly-type/table-formly-type.component';
import { MonthFormlyTypeComponent } from "./types/month-formly-type/month-formly-type.component";
import { YearFormlyTypeComponent } from "./types/year-formly-type/year-formly-type.component";
import { DateFromToFormlyTypeComponent } from './types/date-from-to-formly-type/date-from-to-formly-type.component';
import { DaterangeFormlyTypeComponent } from './types/daterange-formly-type/daterange-formly-type.component';
// import { ComboInputFormlyTypeComponent } from './types/combo-input-formly-type/combo-input-formly-type.component';
// import { NumberFormlyTypeComponent } from './types/number-formly-type/number-formly-type.component';
// import { StepperFormlyTypeComponent } from './types/stepper-formly-type/stepper-formly-type.component';
// import { ButtonDropdownFormlyTypeComponent } from './types/button-dropdown-formly-type/button-dropdown-formly-type.component';
// import { DatetimeFormlyTypeComponent } from './types/datetime-formly-type/datetime-formly-type.component';
// import { TabFormlyTypeComponent } from './types/tab-formly-type/tab-formly-type.component';
// import { SwitchButtonFormlyTypeComponent } from './types/switch-button-formly-type/switch-button-formly-type.component';
// import { ProgressFormlyTypeComponent } from './types/progress-formly-type/progress-formly-type.component';
import {InputFormlyTypeComponent} from './types/input-formly-type/input-formly-type.component';
import {TitleFormlyTypeComponent} from "./types/title-formly-type/title-formly-type.component";
import { TextareaFormlyTypeComponent } from './types/textarea-formly-type/textarea-formly-type.component';
import {IconDeleteFormlyTypeComponent} from "./types/icon-delete-formly-type/icon-delete-formly-type.component";
import {AutocompleteFormlyTypeComponent} from "./types/autocomplete-formly-type/autocomplete-formly-type.component";
import {Calendar} from "primeng/calendar";
import {HourRangeFromlyTypeComponent} from "./types/hour-range-fromly-type/hour-range-fromly-type.component";
import {CurrencyInputFormlyTypeComponent} from "./types/currency-input-formly-type/currency-input-formly-type.component";
import {CurrencyFormlyTypeComponent} from "./types/currency-formly-type/currency-formly-type.component";
import {MultiselectFormlyShortTypeComponent} from './types/multiselect-formly-short-type/multiselect-formly-short-type.component';
// import { AddressFormlyTypeComponent } from './types/address-formly-type/address-formly-type.component';
// import { BusinessFormlyTypeComponent } from './types/business-formly-type/business-formly-type.component';
// import { TdWrapperComponent } from './wrappers/td-wrapper.component';
// import { RadioPackageFormlyTypeComponent } from './types/radio-package-formly-type/radio-package-formly-type.component';
// import { TypeAheadComponent } from "@vt88/core/src/ui-form/types/type-ahead/type-ahead.component";
// import { FormlyFieldWrapperWarningComponent } from './wrappers/field-wrapper-warning.component';
// import { ContractNumberFormlyTypeComponent } from './types/advances/contract-number-formly-type/contract-number-formly-type.component';
// import { IdentityNumberFormlyTypeComponent } from './types/advances/identity-number-formly-type/identity-number-formly-type.component';
// import { BusinessLicenseFormlyTypeComponent } from './types/advances/business-license-formly-type/business-license-formly-type.component';
// import { IdentityFormlyTypeComponent } from './types/identity-formly-type/identity-formly-type.component';
// import { BusinessInputFormlyComponent } from './types/business-input-formly-type/business-input-formly.component';
// import { InputSearchFormlyTypeComponent } from './types/input-search-formly-type/input-search-formly-type.component';
// import { SearchBoxFormlyTypeComponent } from './types/search-box-formly-type/search-box-formly-type.component';
// import { InputSearchIdNoFormlyTypeComponent } from '@vt88/core/src/ui-form/types/input-search-idNo-formly-type/input-search-idNo-formly-type.component';

export const UI = {
  VALIDATION: {
    MIN: 'min'
  },
  FIELD_TYPE: {
    BUTTON: 'button'
   , CURRENCY: 'currency'
    , INPUT: 'input'
    , LABEL: 'label'
  }
};


export const config: ConfigOption = {
  validationMessages: [
    //  { name: 'required', message: requireValidationMessage },
    // { name: 'minlength', message: minlengthValidationMessage },
    // { name: 'maxlength', message: maxlengthValidationMessage },
    { name: UI.VALIDATION.MIN, message: minValidationMessage },
    { name: 'max', message: maxValidationMessage },
    { name: 'maximumMoney', message: maxMoneyValidationMessage },
    { name: 'minimumMoney', message: minMoneyValidationMessage },
    { name: 'toDateRangeInvalid', message: toDateRangeValidationMsg },
    { name: 'fromDateRangeInvalid', message: fromDateRangeValidationMsg }

  ],
  // wrappers: [
  //   { name: 'panel', component: PanelWrapperComponent },
  //   { name: 'box', component: BoxWrapperComponent },
  //   { name: 'error-on-top', component: ErrorWrapperComponent },
  //   { name: 'validate-wrapper', component: FormlyFieldWrapperComponent },
  //   { name: 'form-field', component: FormlyFieldWrapperComponent },
  //   // { name: 'form-field-warning', component: FormlyFieldWrapperWarningComponent },
  //   // { name: 'td', component: TdWrapperComponent },
  //
  // ],
  types: [
    // { name: 'button', component: ButtonFormlyTypeComponent },
    // { name: 'buttondropdown', component: ButtonDropdownFormlyTypeComponent },
    { name: 'radio', component: RadioFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'radiopackage', component: RadioPackageFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'checkbox', component: CheckboxFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'date', component: DateFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'month', component: MonthFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'year', component: YearFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'datetime', component: DatetimeFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'daterange', component: DaterangeFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'datefromto', component: DateFromToFormlyTypeComponent },
    { name: 'autocomplete', component: AutocompleteFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'search-box', component: SearchBoxFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'multiselect', component: MultiselectFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'multiselect-short', component: MultiselectFormlyShortTypeComponent, wrappers: ['form-field'] },
    { name: 'select', component: SelectFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'tag', component: TagFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'repeattable', component: RepeatTableFormlyTypeComponent },
    // { name: 'repeatsection', component: RepeatSectionFormlyTypeComponent },
    // { name: 'percentage', component: PercentageFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'money', component: MoneyFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'table', component: TableFormlyTypeComponent },
    // { name: 'comboinput', component: ComboInputFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'currency', component: CurrencyInputFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'identity', component: IdentityFormlyTypeComponent },
    // { name: 'businessinput', component: BusinessInputFormlyComponent },
    // { name: 'number', component: NumberFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'stepper', component: StepperFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'tab', component: TabFormlyTypeComponent },
    // { name: 'switch', component: SwitchButtonFormlyTypeComponent },
    // { name: 'progress', component: ProgressFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'input', component: InputFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'currency', component: CurrencyFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'hour-range', component: HourRangeFromlyTypeComponent, wrappers: ['form-field'] },
    { name: 'textarea', component: TextareaFormlyTypeComponent, wrappers: ['form-field'] },
    { name: 'iconDelete', component: IconDeleteFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'address', component: AddressFormlyTypeComponent },
    // { name: 'business', component: BusinessFormlyTypeComponent },
    // { name: 'typeahead', component: TypeAheadComponent },
    // { name: 'contractNumber', component: ContractNumberFormlyTypeComponent },
    // { name: 'identityNumber', component: IdentityNumberFormlyTypeComponent },
    // { name: 'businessLicense', component: BusinessLicenseFormlyTypeComponent },
    // { name: 'inputSearch', component: InputSearchFormlyTypeComponent, wrappers: ['form-field'] },
    // { name: 'inputSearchSingleSerial', component: InputSearchSingleSerialTypeComponent, wrappers: ['form-field'] },
    { name: 'title', component: TitleFormlyTypeComponent },
    // { name: 'inputSearchIdNo', component: InputSearchIdNoFormlyTypeComponent, wrappers: ['form-field'] }

  ]
  // ,
  // validators.ts: [
  //   { name: 'maximumMoneyValidation', validation: maximumMoneyValidation },
  //   { name: 'minimumMoneyValidation', validation: minimumMoneyValidation }
  // ]
};
