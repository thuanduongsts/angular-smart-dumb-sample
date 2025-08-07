import { ChangeDetectionStrategy, Component, forwardRef, input, numberAttribute } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlAccessor } from '../directives/base-control-accessor.directive';
import { InputDirective } from '../input/input.directive';

@Component({
  selector: 'app-text-area',
  template: ` <textarea
    appCusInput
    [placeholder]="placeholder()"
    [ngModel]="value()"
    [rows]="rows()"
    [disabled]="isDisabled()"
    (ngModelChange)="updateValue($event)"
  ></textarea>`,
  styles: `
    textarea
      resize: none
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputDirective],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextAreaComponent), multi: true }]
})
export class TextAreaComponent extends BaseControlAccessor<string> {
  public readonly rows = input<number, StrOrNum>(5, { transform: numberAttribute });
  public readonly placeholder = input<string>('');

  protected getDefaultValue(): string {
    return '';
  }
}
