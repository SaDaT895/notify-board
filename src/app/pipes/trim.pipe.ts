import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
  pure: true,
})
export class TrimPipe implements PipeTransform {
  transform(value: string | undefined): string {
    return value ? value.trim() : '';
  }
}
