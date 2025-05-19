import { booleanAttribute, ChangeDetectionStrategy, Component, input, ViewEncapsulation } from '@angular/core';

import { LoadingIconComponent } from '../icon/loading-icon/loading-icon.component';
import { ButtonVariant } from './button-variant.model';

@Component({
  selector: 'button[customButton], a[customButton]',
  standalone: true,
  template: `
    @if (isLoading()) {
      <app-loading-icon />
    }
    <ng-content />
  `,
  styleUrl: './button.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [LoadingIconComponent],
  host: {
    class: 'cus-btn',
    '[class.cus-btn-primary]': `cusType() === 'primary'`,
    '[class.cus-btn-secondary]': `cusType() === 'secondary'`,
    '[class.cus-btn-success]': `cusType() === 'success'`,
    '[class.cus-btn-warning]': `cusType() === 'warning'`,
    '[class.cus-btn-danger]': `cusType() === 'danger'`,
    '[class.outline]': `cusVariant() === 'outline'`,
    '[class.text]': `cusVariant() === 'text'`,
    '[class.link]': `cusVariant() === 'link'`
  }
})
export class Button {
  public readonly cusType = input<ButtonVariant>('primary');
  public readonly cusVariant = input<Maybe<'outline' | 'text' | 'link'>>(undefined);
  public readonly isLoading = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
}
