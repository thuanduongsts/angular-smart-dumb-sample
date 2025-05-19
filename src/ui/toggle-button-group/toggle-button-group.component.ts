import { ChangeDetectionStrategy, Component, contentChildren, DestroyRef, forwardRef, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ToggleButtonComponent } from './toggle-button/toggle-button.component';
import { BaseControlAccessor } from '../directives/base-control-accessor.directive';

@Component({
  selector: 'app-toggle-button-group',
  template: `<ng-content select="app-toggle-button" /> `,
  styleUrl: './toggle-button-group.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButtonGroupComponent),
      multi: true
    }
  ]
})
export class ToggleButtonGroupComponent extends BaseControlAccessor<ID> implements OnInit {
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
