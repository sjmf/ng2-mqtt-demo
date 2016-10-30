import { Pipe, PipeTransform } from '@angular/core';

/**
 * Reverse ngFor ordering with a pipe
 * http://stackoverflow.com/a/35703364/1681205
 */
@Pipe({
    name: 'reverse',
    pure: false
})
export class ReversePipe implements PipeTransform {
    transform(value: string[]) {
        return value.slice().reverse();
    }
}
