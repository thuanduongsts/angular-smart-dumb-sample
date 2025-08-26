import { ChangeDetectionStrategy, Component, DestroyRef, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomSelectComponent, InputComponent, SelectItemModel } from '@ui';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { isEqual } from 'lodash-es';

import { FilterModel } from './filter.model';

@Component({
  selector: 'app-filter',
  imports: [FormsModule, InputComponent, ReactiveFormsModule, CustomSelectComponent],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent implements OnInit {
  public readonly statusOptions = input.required<SelectItemModel[]>();
  public readonly sortOptions = input.required<SelectItemModel[]>();
  public readonly initFilter = input.required<FilterModel>();

  protected readonly form = new FormGroup({
    searchTerm: new FormControl('', { nonNullable: true }),
    statuses: new FormControl<TaskStatus[]>([], { nonNullable: true }),
    sort: new FormControl<'asc' | 'desc'>('asc', { nonNullable: true })
  });

  public readonly filterChanges = output<FilterModel>();

  public constructor(private destroyRef: DestroyRef) {}

  public ngOnInit(): void {
    this.form.setValue(this.initFilter());
    this.form.valueChanges
      .pipe(debounceTime(100), takeUntilDestroyed(this.destroyRef), distinctUntilChanged(isEqual))
      .subscribe({
        next: () => this.filterChanges.emit(this.form.getRawValue())
      });
  }
}
