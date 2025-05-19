import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '@shared/toast.service';
import { TextInputComponent } from '../../../../ui/text-input/text-input.component';
import { TaskDialogService } from './task-dialog.service';
import { TextAreaComponent } from '../../../../ui/text-area/text-area.component';
import { SpinnerComponent } from '../../../../ui/spinner/spinner.component';
import { TaskDialogCloseMessage } from '../model/task-dialog-close-message.model';
import { CheckboxComponent } from '../../../../ui/checkbox/checkbox.component';
import { Button } from '@ui';

@Component({
  standalone: true,
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [TextInputComponent, ReactiveFormsModule, TextAreaComponent, SpinnerComponent, CheckboxComponent, Button],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  readonly #fetching = signal(true);
  readonly #saving = signal(false);
  readonly #deleting = signal(false);
  readonly #closeMessage = signal<TaskDialogCloseMessage | null>(null);

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
  public readonly deleting = this.#deleting.asReadonly();

  public constructor(
    private service: TaskDialogService,
    private dialogRef: DialogRef,
    private toastService: ToastService,
    @Inject(DIALOG_DATA) public dialogData: { id: Maybe<string> }
  ) {
    this.form.controls.id.setValue(dialogData.id || '');
  }

  public ngOnInit(): void {
    if (this.dialogData.id) {
      this.service.getDetails(this.id).subscribe({
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
    if (this.form.controls.id.value) {
      this.service.updateTask(this.id, this.form.getRawValue()).subscribe({
        next: value => {
          this.form.patchValue(value);
          this.form.markAsPristine();
          this.#closeMessage.set({ type: 'updated', task: value });
          this.toastService.show('Task updated successfully');
          this.#saving.set(false);
        },
        error: () => {
          this.#saving.set(false);
          this.toastService.show('Task update failed');
        }
      });
    } else {
      this.service
        .createTask({
          ...this.form.getRawValue()
        })
        .subscribe({
          next: value => {
            this.form.patchValue(value);
            this.form.markAsPristine();
            this.#closeMessage.set({ type: 'created', task: value });
            this.toastService.show('Task created successfully');
            this.#saving.set(false);
          },
          error: () => {
            this.#saving.set(false);
            this.toastService.show('Task create failed');
          }
        });
    }
  }

  public deleteTask(): void {
    this.#deleting.set(true);

    this.service.deleteTask(this.id).subscribe({
      next: () => {
        this.#closeMessage.set({ type: 'deleted', task: this.form.getRawValue() });
        this.toastService.show('Task deleted successfully');
        this.closeDialog();
      },
      error: () => {
        this.#deleting.set(false);
        this.toastService.show('Task delete failed');
      }
    });
  }

  public closeDialog(): void {
    this.dialogRef.close(this.#closeMessage());
  }
}
