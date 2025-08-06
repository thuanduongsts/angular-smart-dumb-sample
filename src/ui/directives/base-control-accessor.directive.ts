import { booleanAttribute, Directive, HostListener, input, signal } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { isEqual } from 'lodash-es';

@Directive()
export abstract class BaseControlAccessor<T, P = any> implements ControlValueAccessor {
  readonly #isDisabled = signal<boolean>(false);
  readonly #value = signal<T>(this.getDefaultValue());

  public readonly isRequired = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly value = this.#value.asReadonly();
  public readonly isDisabled = this.#isDisabled.asReadonly();
  public readonly ariaDescribedby = input<string>('');

  private readonly onChanged = new Array<(value: P) => void>();
  private readonly onTouched = new Array<() => void>();

  @HostListener('focusout') protected focusout(): void {
    this.onTouched.forEach(e => e());
  }

  public registerOnChange(fn: () => void): void {
    this.onChanged.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }

  public writeValue(value: P): void {
    this.#value.set(this.formatInputValue(value));
  }

  public updateValue(value: T): void {
    const currentValue = Array.isArray(this.value()) ? (this.value() as T[]) : this.value();
    const updateValue = Array.isArray(value) ? (value as T[]) : value;
    if (!isEqual(currentValue, updateValue)) {
      const output = this.formatOutputValue(value);
      this.#value.set(value);
      this.onChanged.forEach(it => it(output));
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this.#isDisabled.set(isDisabled);
  }

  protected abstract getDefaultValue(): T;

  protected formatInputValue(value: P): T {
    return value as unknown as T;
  }

  protected formatOutputValue(value: T): P {
    return value as unknown as P;
  }
}
