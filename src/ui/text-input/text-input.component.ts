import { booleanAttribute, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControlAccessorComponent } from '../base-control-accessor.directive';

@Component({
  selector: 'app-text-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './text-input.component.html',
  styleUrl: './text-input.component.sass',
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: TextInputComponent, multi: true }]
})
export class TextInputComponent extends BaseControlAccessorComponent<string> {
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly isShowClear = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly isRequired = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly invalid = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
}
