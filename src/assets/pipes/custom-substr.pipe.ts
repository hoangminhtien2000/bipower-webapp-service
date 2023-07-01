import { Pipe, PipeTransform } from '@angular/core';
@Pipe({ name: 'substr' })
export class CustomSubstrPipe implements PipeTransform{
    transform(value: string, ...args: any[]) {
        let maxLength = 200;
        if(args[0]){
            maxLength = args[0];
        }
        if(value?.length > maxLength){
            return value.substr(0, maxLength) + '...';
        }
        return value;
    }
}
