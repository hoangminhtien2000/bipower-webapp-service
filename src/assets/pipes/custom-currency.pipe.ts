import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'customCurrency' })
export class CustomCurrencyPipe implements PipeTransform{
    transform(value: any, ...args: any[]) {
        let unit = 'VNĐ';
        if(args[0]){
            unit = args[0];
        }
        if(value){
            return (value + '').replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' ' + unit;
        }
        return '';
    }
}
