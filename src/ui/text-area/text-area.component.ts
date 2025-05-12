import { booleanAttribute, ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlAccessorComponent } from '../base-control-accessor.directive';

@Component({
  selector: 'app-text-area',
  templateUrl: './text-area.component.html',
  styleUrl: './text-area.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextAreaComponent),
      multi: true
    }
  ]
})
export class TextAreaComponent extends BaseControlAccessorComponent<string> {
  public readonly label = input<string>('');
  public readonly rows = input<number>(5);
  public readonly placeholder = input<string>('');
  public readonly isRequired = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
}
