import { Component, input, output, OnInit, OnDestroy } from '@angular/core';
import { Task } from '@core/task.model';
import { TaskDialogService } from './task-dialog.service';
import { ButtonComponent } from '../../../../ui/button/button.component';
import { TextInputComponent } from '../../../../ui/text-input/text-input.component';
import { FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.sass',
  imports: [ButtonComponent, TextInputComponent, FormsModule],
  providers: [TaskDialogService]
})
export class TaskDialogComponent implements OnInit, OnDestroy {
  public readonly taskId = input<number | undefined>();
  public readonly save = output<any>();
  public readonly delete = output<any>();
  public readonly cancel = output<void>();

  public title = '';
  public description = '';
  public important = false;
  public isEdit = false;
  public loading = false;

  private _destroy$ = new Subject<void>();

  constructor(private _service: TaskDialogService) {}

  ngOnInit(): void {
    if (this.taskId()) {
      this.isEdit = true;
      this.loading = true;
      this._service.getDetails(this.taskId()!)
        .pipe(takeUntil(this._destroy$))
        .subscribe(task => {
          if (task) {
            this.title = task.title;
            this.description = task.description;
            this.important = task.important;
          }
          this.loading = false;
        });
    }
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  onSave(): void {
    if (!this.title.trim()) return;
    this.loading = true;
    if (this.isEdit && this.taskId()) {
      this._service.updateTask(this.taskId()!, {
        title: this.title,
        description: this.description,
        important: this.important,
      }).subscribe(() => {
        this.save.emit({ type: 'save', data: {
          id: this.taskId(),
          title: this.title,
          description: this.description,
          important: this.important,
        }});
        this.loading = false;
      });
    } else {
      this._service.createTask({
        title: this.title,
        description: this.description,
        completed: false,
        important: this.important,
      }).subscribe(() => {
        this.save.emit({ type: 'save', data: {
          id: Date.now(), // tạm thời, thực tế lấy từ API trả về
          title: this.title,
          description: this.description,
          completed: false,
          important: this.important,
        }});
        this.loading = false;
      });
    }
  }

  onDelete(): void {
    if (this.taskId()) {
      this.loading = true;
      this._service.deleteTask(this.taskId()!).subscribe(() => {
        this.delete.emit({ type: 'delete', data: this.taskId() });
        this.loading = false;
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 