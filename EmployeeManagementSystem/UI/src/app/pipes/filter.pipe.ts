import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], searchTerm: string, fields: string[] = []): any[] {
    if (!items || !searchTerm) return items;

    searchTerm = searchTerm.toLowerCase();

    return items.filter(item =>
      fields.some(field =>
        item[field]?.toString().toLowerCase().includes(searchTerm)
      )
    );
  }
}
