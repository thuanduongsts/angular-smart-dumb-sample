import { ChangeDetectionStrategy, Component, forwardRef, input } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseControlAccessor } from 'src/ui/directives/base-control-accessor.directive';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [FormsModule]
})
export class CheckboxComponent extends BaseControlAccessor<boolean> {
  public readonly label = input.required<string>();
}
