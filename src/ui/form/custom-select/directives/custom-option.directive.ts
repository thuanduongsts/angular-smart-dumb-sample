import { Directive, TemplateRef } from '@angular/core';

import { SelectItemModel } from '../models/select-item.model';

@Directive({
  selector: '[appCustomOption]'
})
export class CustomOptionDirective {
  public constructor(public templateRef: TemplateRef<{ option: SelectItemModel; isChecked: boolean }>) {}
}
