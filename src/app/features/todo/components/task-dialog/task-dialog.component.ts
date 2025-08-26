import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@shared/toast.service';
import { StaticDataService } from '@shared/services/static-data.service';
import { SectionTitleDirective } from '@shared/directives/section-title.directive';
import { AsyncPipe } from '@angular/common';
import {
  Button,
  CustomSelectComponent,
  InputComponent,
  SelectItemModel,
  SkeletonComponent,
  TextAreaComponent
} from '@ui';
import { finalize, Observable, shareReplay } from 'rxjs';

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
    AsyncPipe,
    SkeletonComponent,
    SectionTitleDirective
  ],
  providers: [TaskDialogService, StaticDataService]
})
export class TaskDialogComponent implements OnInit {
  readonly #isFetching = signal(false);
  readonly #isLoading = signal(false);

  protected priorityOptions$: Observable<SelectItemModel[]>;
  protected statusOptions$: Observable<SelectItemModel[]>;
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
    private staticDataService: StaticDataService,
    @Inject(DIALOG_DATA) public taskId: string
  ) {
    this.priorityOptions$ = this.staticDataService.getListPriority().pipe(shareReplay(1));
    this.statusOptions$ = this.staticDataService.getListTaskStatus().pipe(shareReplay(1));
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
