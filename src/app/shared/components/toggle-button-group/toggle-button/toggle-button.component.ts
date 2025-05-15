import { booleanAttribute, ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButtonComponent {
  public readonly value = input.required<ID>();
  public readonly isActive = input.required<boolean, StrOrBool>({ transform: booleanAttribute });
  public readonly ariaLabel = input.required<string>();

  public readonly toggled = output<ID>();
}
