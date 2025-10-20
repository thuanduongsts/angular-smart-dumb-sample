import { ChangeDetectionStrategy, Component, forwardRef, input, numberAttribute } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlAccessor } from '../../directives/base-control-accessor.directive';
import { InputComponent } from '../../form/input/input.component';

@Component({
  selector: 'app-text-area',
  template: ` <textarea
    appCusInput
    [attr.id]="id()"
    [placeholder]="placeholder()"
    [ngModel]="value()"
    [rows]="rows()"
    [disabled]="isDisabled()"
    (ngModelChange)="updateValue($event)"
  ></textarea>`,
  styleUrl: './text-area.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputComponent],
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TextAreaComponent), multi: true }]
})
export class TextAreaComponent extends BaseControlAccessor<string> {
  public readonly id = input<Nullable<string>>(null);
  public readonly rows = input<number, StrOrNum>(3, { transform: numberAttribute });
  public readonly placeholder = input<string>('');

  protected getDefaultValue(): string {
    return '';
  }
}
