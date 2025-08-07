import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  RepositionScrollStrategy,
  ScrollStrategyOptions
} from '@angular/cdk/overlay';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, forwardRef, inject } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { StringJoinPipe } from '@shared/pipes/string-join.pipe';

import { IconComponent } from '../icon/icon.component';
import { CustomOptionDirective } from './directives/custom-option.directive';
import { CustomSelectedValuesDirective } from './directives/custom-selected-values.directive';
import { SelectPanelComponent } from './components/select-panel/select-panel.component';
import { BaseSelectDirective } from './directives/base-select.directive';

@Component({
  selector: 'app-custom-select',
  imports: [
    ReactiveFormsModule,
    IconComponent,
    FormsModule,
    StringJoinPipe,
    SelectPanelComponent,
    CdkOverlayOrigin,
    CdkConnectedOverlay,
    NgTemplateOutlet
  ],
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'combobox',
    'aria-haspopup': 'listbox',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.aria-describedby]': 'ariaDescribedby()',
    '[attr.aria-expanded]': 'isPanelOpen()',
    '[attr.aria-disabled]': 'isDisabled().toString()',
    '[class.select-disabled]': 'isDisabled()',
    '(click)': 'togglePanelSelection()'
  }
})
export class CustomSelectComponent extends BaseSelectDirective {
  protected readonly isSearchable: boolean = false;

  public readonly scrollStrategy: RepositionScrollStrategy = inject(ScrollStrategyOptions).reposition();
  public readonly optionTemplate = contentChild<CustomOptionDirective>(CustomOptionDirective);
  public readonly selectedValuesTemplate = contentChild<CustomSelectedValuesDirective>(CustomSelectedValuesDirective);
}
