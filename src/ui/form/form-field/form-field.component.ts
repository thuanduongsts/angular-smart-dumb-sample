import { AfterContentInit, ChangeDetectionStrategy, Component, contentChild, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { filter, map, switchMap } from 'rxjs';

import { FormLabelComponent } from './form-label/form-label.component';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormFieldComponent implements AfterContentInit {
  readonly #isControlInvalid = signal(false);
  readonly #errorMessage = signal('');

  protected readonly ngControl = contentChild(NgControl);
  protected readonly ngControl$ = toObservable(this.ngControl);
  protected readonly formLabelComponent = contentChild(FormLabelComponent);
  protected readonly errorMessage = this.#errorMessage.asReadonly();

  public constructor(private destroyRef: DestroyRef) {}

  public ngAfterContentInit(): void {
    this.#setupEventsControlChange();
  }

  #setupEventsControlChange(): void {
    if (!this.ngControl()) {
      return;
    }

    this.ngControl$
      .pipe(
        filter(Boolean),
        switchMap(ngControl => ngControl.control!.events.pipe(map(() => ngControl!))),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: control => {
          this.#isControlInvalid.set(Boolean(control.invalid && control.touched));
          this.formLabelComponent()?.updateControlInvalid(this.#isControlInvalid());
          this.#errorMessage.set(this.#getErrorMessage(control));
        }
      });
  }

  #getErrorMessage(control: NgControl): string {
    if (!this.#isControlInvalid()) {
      return '';
    }

    if (control.hasError('required')) {
      return 'This field is required';
    }

    return 'This field is invalid';
  }
}
