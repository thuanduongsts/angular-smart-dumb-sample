import { Directive, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class BaseControlAccessorComponent<T> implements ControlValueAccessor {
  readonly #isDisabled = signal<boolean>(false);
  readonly #value = signal<Maybe<T>>(undefined);
  readonly #isTouched = signal<boolean>(false);

  public readonly value = this.#value.asReadonly();
  public readonly isDisabled = this.#isDisabled.asReadonly();
  public readonly isTouched = this.#isTouched.asReadonly();

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
      this.markAsTouched();
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this.#isDisabled.set(isDisabled);
  }

  public markAsTouched(): void {
    if (!this.#isTouched()) {
      this.#isTouched.set(true);
      this.onTouched.forEach(it => it());
    }
  }
}
