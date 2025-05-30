import { Directive, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class BaseControlAccessor<T> implements ControlValueAccessor {
  readonly #isDisabled = signal<boolean>(false);
  readonly #value = signal<Maybe<T>>(undefined);

  public readonly value = this.#value.asReadonly();
  public readonly isDisabled = this.#isDisabled.asReadonly();

  private readonly onChanged = new Array<(value: T) => void>();
  private readonly onTouched = new Array<() => void>();

  public registerOnChange(fn: () => void): void {
    this.onChanged.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }

  public writeValue(value: T): void {
    this.#value.set(value);
  }

  public updateValue(value: T): void {
    if (this.value() !== value) {
      this.#value.set(value);
      this.onChanged.forEach(it => it(value));
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this.#isDisabled.set(isDisabled);
  }
}
