import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskStatuses } from '@common/constants/task-statuses.constant';
import { TaskPriorities } from '@common/constants/task-priorities.constant';
import { transformValueToSelectItems } from '@shared/converters/transform-value-to-select-items.converter';
import {
  Button,
  CustomSelectComponent,
  InputComponent,
  SelectItemModel,
  SkeletonComponent,
  TextAreaComponent,
  ToastService,
  TypographyComponent
} from '@ui';
import { finalize } from 'rxjs';

import { TaskModel } from '../../model/task.model';
import { TaskDialogService } from './services/task-dialog.service';

@Component({
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [
    ReactiveFormsModule,
    TextAreaComponent,
    Button,
    InputComponent,
    CustomSelectComponent,
    SkeletonComponent,
    TypographyComponent
  ],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  readonly #isFetching = signal(false);
  readonly #isLoading = signal(false);

  protected priorityOptions = signal<SelectItemModel[]>(transformValueToSelectItems(TaskPriorities));
  protected statusOptions = signal<SelectItemModel[]>(transformValueToSelectItems(TaskStatuses));
  protected readonly isLoading = this.#isLoading.asReadonly();
  protected readonly isFetching = this.#isFetching.asReadonly();
  protected readonly form = new FormGroup({
    id: new FormControl<ID>('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('Todo', { nonNullable: true }),
    priority: new FormControl<TaskPriority>('Medium', { nonNullable: true })
  });

  get isEdit(): boolean {
    return Boolean(this.taskId);
  }

  get formValue(): TaskModel {
    return this.form.getRawValue();
  }

  public constructor(
    private service: TaskDialogService,
    private dialogRef: DialogRef<Nullable<TaskModel>>,
    private toastService: ToastService,
    @Inject(DIALOG_DATA) public taskId: string
  ) {
    this.form.controls.id.setValue(taskId);
  }

  public ngOnInit(): void {
    if (this.isEdit) {
      this.#fetchDetails();
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.#isLoading.set(true);
    const submitRequest$ = this.isEdit ? this.service.update(this.formValue) : this.service.create(this.formValue);
    submitRequest$.pipe(finalize(() => this.#isLoading.set(false))).subscribe({
      next: () => {
        this.toastService.show(this.isEdit ? 'Updated task successfully.' : 'Created task successfully.');
        if (!this.isEdit) {
          this.close();
        }
      },
      error: () => this.toastService.show('Failed to create task.')
    });
  }

  protected close(): void {
    this.dialogRef.close(this.formValue);
  }

  #fetchDetails(): void {
    this.#isFetching.set(true);
    this.service
      .getDetails(this.taskId)
      .pipe(finalize(() => this.#isFetching.set(false)))
      .subscribe({
        next: details => this.form.patchValue(details)
      });
  }
}
