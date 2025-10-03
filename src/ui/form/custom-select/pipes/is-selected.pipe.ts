import { Pipe, PipeTransform } from '@angular/core';

import { SelectItemModel } from '../models/select-item.model';

@Pipe({
  name: 'isSelected'
})
export class IsSelectedPipe implements PipeTransform {
  public transform(option: SelectItemModel, selectedOptions: SelectItemModel[]): boolean {
    return selectedOptions.some(it => it.id === option.id);
  }
}
