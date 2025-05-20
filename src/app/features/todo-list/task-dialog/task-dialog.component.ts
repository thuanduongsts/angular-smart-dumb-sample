import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@shared/toast.service';
import { Button, CheckboxComponent, SpinnerComponent, TextAreaComponent, TextInputComponent } from '@ui';

import { TaskDialogService } from './task-dialog.service';
import { TaskModel } from '../model/task.model';

@Component({
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [TextInputComponent, ReactiveFormsModule, TextAreaComponent, SpinnerComponent, CheckboxComponent, Button],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  readonly #fetching = signal(true);
  readonly #saving = signal(false);

  #hasSaved = false;

  public readonly form = new FormGroup({
    id: new FormControl<ID>('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    important: new FormControl(false, { nonNullable: true }),
    completed: new FormControl(false, { nonNullable: true })
  });

  get id(): ID {
    return this.form.controls.id.value;
  }

  public readonly fetching = this.#fetching.asReadonly();
  public readonly saving = this.#saving.asReadonly();

  public constructor(
    private service: TaskDialogService,
    private dialogRef: DialogRef<{ hasSaved: boolean }>,
    private toastService: ToastService,
    @Inject(DIALOG_DATA) public dialogData: { id: Maybe<string> }
  ) {
    this.form.controls.id.setValue(dialogData.id || '');
  }

  public ngOnInit(): void {
    if (this.dialogData.id) {
      this.service.getTaskDetails(this.id).subscribe({
        next: details => {
          this.#fetching.set(false);
          this.form.patchValue(details);
        },
        error: () => {
          this.#fetching.set(false);
        }
      });
    } else {
      this.#fetching.set(false);
    }
  }

  public submitTask(): void {
    this.#saving.set(true);
    if (this.id) {
      this.service.updateTask(this.id, this.form.getRawValue()).subscribe({
        next: value => {
          this.#updateStatesAfterSaved(value);
          this.toastService.show('Updated task successfully.');
        },
        error: () => {
          this.#saving.set(false);
          this.toastService.show('Failed to update task.');
        }
      });
    } else {
      this.service.createTask(this.form.getRawValue()).subscribe({
        next: value => {
          this.#updateStatesAfterSaved(value);
          this.toastService.show('Created task successfully.');
        },
        error: () => {
          this.#saving.set(false);
          this.toastService.show('Failed to create task.');
        }
      });
    }
  }

  #updateStatesAfterSaved(newValue: TaskModel): void {
    this.form.patchValue(newValue);
    this.form.markAsPristine();
    this.#saving.set(false);
    this.#hasSaved = true;
  }

  public closeDialog(): void {
    this.dialogRef.close({ hasSaved: this.#hasSaved });
  }
}
