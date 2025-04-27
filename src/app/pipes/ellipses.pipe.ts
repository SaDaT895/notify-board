import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipses',
  pure: true,
})
export class EllipsesPipe implements PipeTransform {
  transform(value: string): string {
    return value.length > 30 ? value.slice(0, 30) + '...' : value;
  }
}
