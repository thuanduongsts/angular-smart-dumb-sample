import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Button } from '../../button/button.component';

@Component({
  selector: 'app-toggle-button',
  template: `
    <button
      customButton
      class="toggle-button"
      [cusType]="isActive() ? 'primary' : 'secondary'"
      [cusVariant]="isActive() ? undefined : 'text'"
      [attr.aria-label]="ariaLabel()"
      (click)="toggled.emit(value())"
    >
      <ng-content />
    </button>
  `,
  styles: `
    button
      padding: 8px 16px
      border-radius: 100px

  `,
  imports: [Button],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButtonComponent {
  public readonly value = input.required<ID>();
  public readonly isActive = input.required<boolean, StrOrBool>({ transform: booleanAttribute });
  public readonly ariaLabel = input.required<string>();

  public readonly toggled = output<ID>();
}
