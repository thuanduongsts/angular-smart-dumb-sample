import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringJoin'
})
export class StringJoinPipe implements PipeTransform {
  public transform(value: string[]): string {
    return value.join(', ');
  }
}
