import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'yearWorking'
})
export class CustomYearWorkingPipe implements PipeTransform {
  
  transform(numberMonth: number, ...args: any[]): any {
    if(numberMonth){
      const year = (Math.floor(numberMonth / 12) + '').padStart(2, '0');
      const month = (Math.floor(numberMonth % 12) + '').padStart(2, '0');
      let result = '';
      if(year != '00'){
        result += `${year} năm `;
      }
      if(month != '00'){
        result += `${month} tháng`;
      }
      return result;
    }
    return numberMonth+'';
  }

}
