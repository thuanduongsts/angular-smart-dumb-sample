import { Component, DestroyRef, Inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { ButtonComponent, TextInputComponent } from '@ui';

import { TaskDialogService } from './task-dialog.service';
import { TaskModel } from '@common/models/task.model';

@Component({
  standalone: true,
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [ButtonComponent, TextInputComponent, FormsModule, ReactiveFormsModule],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit {
  public readonly taskId = input<Maybe<number>>();
  public readonly isEdit = signal<boolean>(false);

  public readonly save = output<any>();
  public readonly delete = output<any>();
  public readonly cancel = output<void>();

  public readonly form: FormGroup<{
    title: FormControl<string>;
    description: FormControl<string>;
    important: FormControl<boolean>;
  }> = new FormGroup({
    title: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    description: new FormControl('', { validators: [Validators.required], nonNullable: true }),
    important: new FormControl(false, { nonNullable: true })
  });

  public title = '';
  public description = '';
  public important = false;
  public loading = false;

  public constructor(
    private service: TaskDialogService,
    private destroyRef: DestroyRef,
    private dialogRef: DialogRef<TaskDialogComponent>,
    @Inject(DIALOG_DATA) private data: TaskModel
  ) {
    this.isEdit.set(Boolean(this.data));
    if (this.isEdit()) {
      this.form.patchValue(this.data, { emitEvent: false });
    }
  }

  public ngOnInit(): void {}

  public onSave(): void {
    if (!this.title.trim()) return;
    this.loading = true;

    if (this.isEdit()) {
      this.service
        .updateTask(this.taskId()!, {
          title: this.title,
          description: this.description,
          important: this.important
        })
        .subscribe(() => {
          this.save.emit({
            type: 'save',
            data: {
              id: this.taskId(),
              title: this.title,
              description: this.description,
              important: this.important
            }
          });
          this.loading = false;
        });
    } else {
      this.service
        .createTask({
          title: this.title,
          description: this.description,
          completed: false,
          important: this.important
        })
        .subscribe(() => {
          this.save.emit({
            type: 'save',
            data: {
              id: Date.now(), // tạm thời, thực tế lấy từ API trả về
              title: this.title,
              description: this.description,
              completed: false,
              important: this.important
            }
          });
          this.loading = false;
        });
    }
  }

  public onDelete(): void {
    if (this.taskId()) {
      this.loading = true;
      this.service.deleteTask(this.taskId()!).subscribe(() => {
        this.delete.emit({ type: 'delete', data: this.taskId() });
        this.loading = false;
      });
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
