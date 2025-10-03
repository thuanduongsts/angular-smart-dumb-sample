import { ChangeDetectionStrategy, Component, ElementRef, input, output, Signal, viewChildren } from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CheckboxComponent } from '../../../checkbox/checkbox.component';
import { IsSelectedPipe } from '../../pipes/is-selected.pipe';
import { CustomOptionDirective } from '../../directives/custom-option.directive';
import { SelectItemModel } from '../../models/select-item.model';

@Component({
  selector: 'app-select-panel',
  imports: [CheckboxComponent, IsSelectedPipe, NgTemplateOutlet, FormsModule, NgClass],
  templateUrl: './select-panel.component.html',
  styleUrl: './select-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'listbox'
  }
})
export class SelectPanelComponent {
  public readonly options = input.required<SelectItemModel[]>();
  public readonly selectedOptions = input.required<SelectItemModel[]>();
  public readonly focusIndex = input.required<number>();
  public readonly isMultiple = input.required<boolean>();
  public readonly customOptionTemplate = input<CustomOptionDirective>();
  public readonly optionElements: Signal<readonly ElementRef<HTMLDivElement>[]> = viewChildren('optionEl');

  public readonly selectChange = output<{ event: Event; option: SelectItemModel; index: number }>();

  get element(): HTMLElement {
    return this.elementRef.nativeElement;
  }

  public constructor(private elementRef: ElementRef) {}

  public onSelectChange(event: Event, option: SelectItemModel, index: number): void {
    if (option.isDisable) {
      return;
    }

    this.selectChange.emit({ event, option, index });
  }
}
