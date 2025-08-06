import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, Signal, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@shared/toast.service';
import { Button, CustomSelectComponent, InputDirective, SelectItemModel, TextAreaComponent } from '@ui';
import { finalize } from 'rxjs';

import { TaskDialogService } from './services/task-dialog.service';
import { TaskModel } from '../model/task.model';

@Component({
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [ReactiveFormsModule, TextAreaComponent, Button, InputDirective, CustomSelectComponent],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  readonly #isFetching = signal(false);
  readonly #isLoading = signal(false);

  protected readonly priorityOptions: Signal<SelectItemModel[]> = signal([
    { id: 'High', name: 'High' },
    { id: 'Medium', name: 'Medium' },
    { id: 'Low', name: 'Low' }
  ]).asReadonly();

  public readonly isLoading = this.#isLoading.asReadonly();
  public readonly isFetching = this.#isFetching.asReadonly();
  public readonly form = new FormGroup<ControlsOf<TaskModel>>({
    id: new FormControl<ID>('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    status: new FormControl<TaskStatus>('Todo', { nonNullable: true }),
    priority: new FormControl<TaskPriority>('Medium', { nonNullable: true })
  });

  #hasSaved = false;

  get isEdit(): boolean {
    return Boolean(this.dialogData.id);
  }

  public constructor(
    private service: TaskDialogService,
    private dialogRef: DialogRef<{ hasSaved: boolean }>,
    private toastService: ToastService,
    @Inject(DIALOG_DATA) public dialogData: { id: Maybe<string> }
  ) {
    this.form.controls.id.setValue(dialogData.id || '');
  }

  public ngOnInit(): void {
    if (this.isEdit) {
      this.#fetchDetails();
    }
  }

  public submitTask(): void {
    if (this.form.invalid) {
      return;
    }

    const formValue = this.form.getRawValue() as TaskModel;
    this.#isLoading.set(true);

    const submitRequest$ = this.isEdit ? this.service.update(formValue.id, formValue) : this.service.create(formValue);
    submitRequest$.pipe(finalize(() => this.#isLoading.set(false))).subscribe({
      next: value => {
        this.#updateStatesAfterSaved(value);
        const message = this.isEdit ? 'Updated task successfully.' : 'Created task successfully.';
        this.toastService.show(message);
      },
      error: () => {
        this.toastService.show('Failed to create task.');
      }
    });
  }

  #updateStatesAfterSaved(newValue: TaskModel): void {
    this.form.patchValue(newValue);
    this.form.markAsPristine();
    this.#hasSaved = true;
  }

  #fetchDetails(): void {
    this.#isFetching.set(true);
    this.service
      .getDetails(this.dialogData.id!)
      .pipe(finalize(() => this.#isFetching.set(false)))
      .subscribe({
        next: details => this.form.patchValue(details)
      });
  }

  public closeDialog(): void {
    this.dialogRef.close({ hasSaved: this.#hasSaved });
  }
}
