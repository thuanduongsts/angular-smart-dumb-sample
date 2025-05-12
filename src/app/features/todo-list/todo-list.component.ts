import { ChangeDetectionStrategy, Component, inject, signal, computed, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Dialog } from '@angular/cdk/dialog';

import { TodoListService } from './todo-list.service';
import { TaskListComponent } from './task-list/task-list.component';
import { ButtonComponent } from '../../../ui/button/button.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskModel } from './model/task.model';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, ButtonComponent],
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

  public openDialog(id?: string): void {
    const dialogRef = this.#dialog.open(TaskDialogComponent, {
      data: { id },
      width: '600px'
    });
    dialogRef.closed.subscribe(() => this.loadTasks());
  }

  public handleToggleCompleted(id: string): void {
    const task = this.#tasks().find(t => t.id === id);
    if (!task) return;
    this.#service.updateCompleted(id, !task.completed).subscribe({
      next: () => {
        this.#tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
      }
    });
  }

  public handleToggleImportant(id: string): void {
    const task = this.#tasks().find(t => t.id === id);
    if (!task) return;
    this.#service.updateImportant(id, !task.important).subscribe({
      next: () => {
        this.#tasks.update(tasks => tasks.map(t => (t.id === id ? { ...t, important: !t.important } : t)));
      }
    });
  }
}
