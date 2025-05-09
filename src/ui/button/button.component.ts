import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  input,
  numberAttribute
} from '@angular/core';

import { ButtonVariant } from './button-variant.model';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html',
  styleUrl: './button.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  public readonly type = input<'submit' | 'button'>('button');
  public readonly variant = input<ButtonVariant>('primary');
  public readonly outlined = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly disabled = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly isLoading = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly height = input<number, StrOrNum>(48, { transform: numberAttribute });

  get styleClasses(): string[] {
    return [this.variant(), this.outlined() ? 'outlined' : '', this.disabled() ? 'disabled' : ''];
  }

  @HostBinding('class.disabled') get disabledButton(): boolean {
    return this.disabled();
  }
}
