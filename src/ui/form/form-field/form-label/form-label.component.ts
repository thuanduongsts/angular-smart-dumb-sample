import { booleanAttribute, ChangeDetectionStrategy, Component, input, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  styleUrl: './form-label.component.sass',
  imports: [NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormLabelComponent {
  readonly #isControlInvalid = signal<boolean>(false);

  protected readonly isControlInvalid = this.#isControlInvalid.asReadonly();

  public readonly required = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly for = input<Nullable<string>>(null);

  public updateControlInvalid(isInvalid: boolean): void {
    this.#isControlInvalid.set(isInvalid);
  }
}
