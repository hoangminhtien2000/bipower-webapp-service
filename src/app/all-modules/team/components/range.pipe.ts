import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range',
  pure: false
})
export class RangePipe implements PipeTransform {

  transform(value: any[], start: number, end: number): any[] {
    if (!value) {
      return [];
    }
    const result = value.filter((el, index) => {
      return index >= start && index <= end;
    });
    return result;
  }

}
