import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customFormatDate'
})
export class CustomFormatDate implements PipeTransform {
  
  transform(value: any, ...args: any[]): any {
    let formatDate:string = 'dd/MM/yyyy';
    if(args[0]){
      formatDate = args[0];
    }
    let pattern1 = /(\d{2})\/(\d{2})\/(\d{4})/;
    if(pattern1.test(value)){
      return value;
    }
    let pattern2 = /^(\d{4})\-(\d{2})\-(\d{2})$/;
    if(pattern2.test(value)){
      return value.replace(/(\d{4})\-(\d{2})\-(\d{2})/, "$3/$2/$1");
    }
    try{
      return new DatePipe('en-US').transform(new Date(value), formatDate);
    }catch(error: any){
      if(!isNaN(parseInt(value))){
        return new DatePipe('en-US').transform(new Date(parseInt(value)), formatDate);
      }
    }
    return '';
  }

}
