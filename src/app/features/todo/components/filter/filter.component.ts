import { ChangeDetectionStrategy, Component, DestroyRef, forwardRef, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseControlAccessor, CustomSelectComponent, InputComponent, SelectItemModel } from '@ui';
import { transformValueToSelectItems } from '@shared/converters/transform-value-to-select-items.converter';
import { debounceTime } from 'rxjs';

import { FilterModel } from './filter.model';

@Component({
  selector: 'app-filter',
  imports: [FormsModule, InputComponent, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FilterComponent),
      multi: true
    }
  ]
})
export class FilterComponent extends BaseControlAccessor<FilterModel> implements OnInit {
  public readonly statusOptions = input.required<SelectItemModel[], TaskStatus[]>({
    transform: value => transformValueToSelectItems(value)
  });
  public readonly sortOptions = input.required<SelectItemModel[]>();

  protected readonly form = new FormGroup({
    searchTerm: new FormControl('', { nonNullable: true }),
    statuses: new FormControl<TaskStatus[]>([], { nonNullable: true }),
    sort: new FormControl<'asc' | 'desc'>('asc', { nonNullable: true })
  });

  public constructor(private destroyRef: DestroyRef) {
    super();
  }

  public ngOnInit(): void {
    this.form.valueChanges.pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.updateValue(this.form.getRawValue())
    });
  }

  public override writeValue(value: FilterModel): void {
    super.writeValue(value);
    this.form.patchValue(value, { emitEvent: false });
  }

  protected getDefaultValue(): FilterModel {
    return {
      searchTerm: '',
      statuses: [],
      sort: 'asc'
    };
  }
}
