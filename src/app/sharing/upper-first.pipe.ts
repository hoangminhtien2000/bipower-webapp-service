import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'upperFirst'
})
export class UpperFirstPipe implements PipeTransform {

    transform(value: string): string {
        if (!value) {
            return '';
        }
        const trim = value.trim();
        return trim[0].toUpperCase() + trim.substring(1).toLowerCase();
    }

}
