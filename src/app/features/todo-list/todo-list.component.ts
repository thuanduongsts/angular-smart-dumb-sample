import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';
import { filter, take } from 'rxjs';

import { TodoListService } from './todo-list.service';
import { TaskListComponent } from './task-list/task-list.component';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskModel } from './model/task.model';
import { SpinnerComponent } from "../../../ui/spinner/spinner.component";
import { TaskDialogCloseMessage } from './model/task-dialog-close-message.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, ButtonComponent, SpinnerComponent],
  providers: [TodoListService]
})
export class TodoListComponent implements OnInit {
  readonly #service = inject(TodoListService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #dialog = inject(Dialog);
  readonly #tasks = signal<TaskModel[]>([]);
  readonly #loading = signal<boolean>(true);

  public readonly activeTasks = computed(() => this.#tasks().filter(t => !t.completed));
  public readonly completedTasks = computed(() => this.#tasks().filter(t => t.completed));
  public readonly loading = this.#loading.asReadonly();

  public ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
    this.#loading.set(true);
    this.#service
      .getTasks()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: tasks => {
          this.#tasks.set(tasks);
          this.#loading.set(false);
        },
        error: () => {
          this.#loading.set(false);
        }
      });
  }

  public openDialog(id?: ID): void {
    const dialogRef = this.#dialog.open<TaskDialogCloseMessage>(TaskDialogComponent, {
      data: { id },
      width: '600px'
    });

    dialogRef.closed.pipe(take(1), filter(Boolean)).subscribe((message: TaskDialogCloseMessage) => this.handleDialogClose(message));
  }

  public handleToggleCompleted(id: ID): void {
    const task = this.#tasks().find(t => t.id === id);
    if (!task) return;
    this.#service.updateCompleted(id, !task.completed).subscribe({
      next: () => {
        this.#tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
      }
    });
  }

  public handleToggleImportant(id: ID): void {
    const task = this.#tasks().find(t => t.id === id);
    if (!task) return;
    this.#service.updateImportant(id, !task.important).subscribe({
      next: () => {
        this.#tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, important: !t.important } : t)));
      }
    });
  }

  public handleDialogClose(message: TaskDialogCloseMessage): void {
    switch (message.type) {
      case 'created':
        this.loadTasks();
        break;
      case 'updated':
        this.#tasks.update(tasks => tasks.map(t => (t.id === message.task.id ? message.task : t)));
        break;
      case 'deleted':
        this.#tasks.update(tasks => tasks.filter(t => t.id !== message.task.id));
        break;
    }
  }
}
