import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlAccessor } from '../directives/base-control-accessor.directive';

@Component({
  selector: 'app-checkbox',
  template: `
    <label>
      <input type="checkbox" [ngModel]="value()" (ngModelChange)="updateValue($event)" />
      @if (label()) {
        {{ label() }}
      }
    </label>
  `,
  styleUrl: './checkbox.component.sass',
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends BaseControlAccessor<boolean> {
  public readonly label = input<string>();

  protected getDefaultValue(): boolean {
    return false;
  }
}
