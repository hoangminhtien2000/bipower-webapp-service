import {Pipe, PipeTransform} from '@angular/core';
import {MaskApplierService} from "ngx-mask";
import {CHARACTERS, CURRENCY_MASK} from "../../../../app/core/common/constant";

@Pipe({
  name: 'bipowerCurrency'
}, )
export class BipowerCurrencyPipe implements PipeTransform {

  public constructor(private _maskService: MaskApplierService) {}

  transform(value: string | number, defaultValue: string = '0'): string {
    if (!value) {
      return defaultValue || '0';
    }

    if(typeof value === 'number') {
      return this.parserNumber(value);
    }

    if(typeof value === 'string') {
      return this.parserString(`${value}`);
    }

    return defaultValue || value;

  }

  private parserString(value: string): string{
    const matchs = value.match(/-?[0-9]\d*(\.\d+)?/g);
    if (!matchs) {
      return '';
    }
    if(matchs.length <= 0) {
      return value;
    }

    matchs.forEach(match => {
      value.replace(match, this.parserNumber(Number(match)));
    });
    return value;
  }

  private parserNumber(value: number) : string{
    let returnValue :string;
    value = +value.toFixed(CURRENCY_MASK.LAO_CONFIG.round);
    if (typeof CURRENCY_MASK.LAO_CONFIG.pattern === 'string') {
      returnValue= this._maskService.applyMask(`${value}`
        , CURRENCY_MASK.LAO_CONFIG.pattern);
    } else {
      returnValue= this._maskService.applyMaskWithPattern(`${value}`
        , CURRENCY_MASK.LAO_CONFIG.pattern);
    }

    if(CURRENCY_MASK.LAO_CONFIG.thousandSeparator === CHARACTERS.DOT){
      returnValue = returnValue
        .replace(/\.+/g, CHARACTERS.COMMA)
        .replace(/\s+/g, CHARACTERS.DOT);
    } else {
      returnValue = returnValue
        .replace(/\s+/g, CHARACTERS.COMMA);
    }

    return returnValue;
  }
}
