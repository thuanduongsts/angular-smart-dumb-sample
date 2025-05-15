import { ChangeDetectionStrategy, Component, contentChildren, DestroyRef, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseControlAccessorComponent } from '@shared/abstraction/base-control-accessor.directive';

import { ToggleButtonComponent } from './toggle-button/toggle-button.component';

@Component({
  selector: 'app-toggle-button-group',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonGroupComponent),
      multi: true
    }
  ],
  templateUrl: './toggle-button-group.component.html',
  styleUrl: './toggle-button-group.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToggleButtonGroupComponent extends BaseControlAccessorComponent<ID> implements OnInit {
  public readonly buttons = contentChildren(ToggleButtonComponent);

  public constructor(private destroyRef: DestroyRef) {
    super();
  }

  public ngOnInit(): void {
    this.buttons().forEach(button => {
      outputToObservable(button.toggled)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value: ID) => this.updateValue(value));
    });
  }
}
