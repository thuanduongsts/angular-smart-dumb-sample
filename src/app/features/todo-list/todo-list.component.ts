import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { catchError, distinct, distinctUntilChanged, EMPTY, filter, map, mergeMap, Subject, take } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Button, IconComponent, IconEnum, ToggleButtonComponent, ToggleButtonGroupComponent } from '@ui';
import { ToastService } from '@shared/toast.service';

import { TaskModel } from './model/task.model';
import { TaskDialogCloseMessage } from './model/task-dialog-close-message.model';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TodoListService } from './todo-list.service';
import { TaskView } from './model/task.enum';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, ToggleButtonGroupComponent, ToggleButtonComponent, FormsModule, Button, IconComponent],
  providers: [TodoListService]
})
export class TodoListComponent implements OnInit {
  readonly #service = inject(TodoListService);
  readonly #dialog = inject(Dialog);
  readonly #toastService = inject(ToastService);

  readonly #tasks = signal<TaskModel[]>([]);
  readonly #loading = signal<boolean>(true);
  readonly #taskImportantRequested$ = new Subject<TaskModel>();
  readonly #taskDeleteRequested$ = new Subject<TaskModel>();

  public readonly IconEnum = IconEnum;
  public readonly TaskView = TaskView;
  public readonly taskViewMode = signal<TaskView>(TaskView.IN_PROGRESS);
  public readonly activeTasks = computed(() => this.#tasks().filter(t => !t.completed));
  public readonly completedTasks = computed(() => this.#tasks().filter(t => t.completed));
  public readonly loading = this.#loading.asReadonly();

  public ngOnInit(): void {
    this.#loadTasks();
    this.#setupUpdateTaskImportant();
    this.#setupDeleteTaskStream();
  }

  public changeViewMode(value: TaskView): void {
    this.taskViewMode.set(value);
  }

  public openDialog(id: Nullable<ID>): void {
    const dialogRef = this.#dialog.open<TaskDialogCloseMessage>(TaskDialogComponent, {
      data: { id },
      width: '600px'
    });

    dialogRef.closed
      .pipe(take(1), filter(Boolean))
      .subscribe((message: TaskDialogCloseMessage) => this.#handleDialogClose(message));
  }

  public handeUpdateTaskImportant(task: TaskModel): void {
    this.#taskImportantRequested$.next(task);
  }

  public handleDeleteTask(task: TaskModel): void {
    this.#taskDeleteRequested$.next(task);
  }

  #loadTasks(): void {
    this.#loading.set(true);
    this.#service.getTasks().subscribe({
      next: tasks => {
        this.#tasks.set(tasks);
        this.#loading.set(false);
      },
      error: () => {
        this.#loading.set(false);
      }
    });
  }

  #handleDialogClose(message: TaskDialogCloseMessage): void {
    switch (message.type) {
      case 'created':
        this.#loadTasks();
        break;
      case 'updated':
        this.#tasks.update(tasks => tasks.map(t => (t.id === message.task.id ? message.task : t)));
        break;
    }
  }

  #setupUpdateTaskImportant(): void {
    this.#taskImportantRequested$
      .pipe(
        distinctUntilChanged(
          (previous, current) => previous.id === current.id && previous.important === current.important
        ),
        mergeMap(task =>
          this.#service.updateTaskImportant(task.id, !task.important).pipe(
            map(() => task.id),
            catchError(() => {
              this.#toastService.show(`Failed to update important status for task: ${task.title}`);
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: id => {
          this.#tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, important: !t.important } : t)));
        }
      });
  }

  #setupDeleteTaskStream(): void {
    this.#taskDeleteRequested$
      .pipe(
        distinct(task => task.id),
        mergeMap(task =>
          this.#service.deleteTask(task.id).pipe(
            map(() => task.id),
            catchError(() => {
              this.#toastService.show(`Failed to delete task: ${task.title}`);
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: id => {
          this.#tasks.update(tasks => tasks.filter(t => t.id !== id));
        }
      });
  }
}
