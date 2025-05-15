import { booleanAttribute, ChangeDetectorRef, Directive, input } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Directive()
export class BaseControlComponent<T> implements ControlValueAccessor {
  private readonly onChanged = new Array<(value: T) => void>();
  private readonly onTouched = new Array<() => void>();

  public readonly isRequired = input<boolean, StrOrBool>(false, { transform: booleanAttribute });

  private _value!: T;

  public isDisabled!: boolean;

  get value(): T {
    return this._value;
  }

  public constructor(protected changeDetector: ChangeDetectorRef) {}

  public registerOnChange(fn: () => void): void {
    this.onChanged.push(fn);
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched.push(fn);
  }

  public writeValue(value: T): void {
    this._value = value;
    this.changeDetector.detectChanges();
  }

  public updateValue(value: T): void {
    if (this.value !== value) {
      this._value = value;
      this.onChanged.forEach(it => it(value));
    }
  }

  public setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.changeDetector.detectChanges();
  }
}
