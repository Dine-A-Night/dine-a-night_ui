import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'metersToKms',
})
export class MetersToKmsPipe implements PipeTransform {
    transform(value: number): number {
        return Number((value / 1000).toFixed(2)); // 1 kilometer = 1000 meters
    }
}
