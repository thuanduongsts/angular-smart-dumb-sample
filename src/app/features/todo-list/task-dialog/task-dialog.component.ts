import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ButtonComponent } from '../../../../ui/button/button.component';
import { TextInputComponent } from '../../../../ui/text-input/text-input.component';
import { TaskDialogService } from './task-dialog.service';
import { TextAreaComponent } from '../../../../ui/text-area/text-area.component';
import { SpinnerComponent } from '../../../../ui/spinner/spinner.component';

@Component({
  standalone: true,
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [ButtonComponent, TextInputComponent, ReactiveFormsModule, TextAreaComponent, SpinnerComponent],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  readonly #fetching = signal(true);
  readonly #saving = signal(false);
  readonly #deleting = signal(false);

  public readonly taskId = signal<Maybe<string>>(undefined);

  public readonly form = new FormGroup({
    id: new FormControl('', { nonNullable: true }),
    title: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    description: new FormControl('', { nonNullable: true }),
    important: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
    completed: new FormControl(false, { nonNullable: true, validators: [Validators.required] })
  });

  public readonly fetching = this.#fetching.asReadonly();
  public readonly saving = this.#saving.asReadonly();
  public readonly deleting = this.#deleting.asReadonly();

  public constructor(
    private service: TaskDialogService,
    private dialogRef: DialogRef<TaskDialogComponent>,
    @Inject(DIALOG_DATA) public dialogData: { id: Maybe<string> }
  ) {
    this.taskId.set(dialogData.id);
  }

  public ngOnInit(): void {
    if (this.taskId()) {
      this.service.getDetails(this.taskId()!).subscribe({
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
    if (this.taskId()) {
      this.service.updateTask(this.taskId()!, this.form.getRawValue()).subscribe({
        next: () => {
          this.#saving.set(false);
        },
        error: () => {
          this.#saving.set(false);
        }
      });
    } else {
      this.service
        .createTask({
          ...this.form.getRawValue()
        })
        .subscribe({
          next: () => {
            this.#saving.set(false);
          },
          error: () => {
            this.#saving.set(false);
          }
        });
    }
  }

  public deleteTask(): void {
    this.#deleting.set(true);
    if (this.taskId()) {
      this.service.deleteTask(this.taskId()!).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          this.#deleting.set(false);
        }
      });
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }
}
