import { Dialog } from '@angular/cdk/dialog';
import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { filter, take } from 'rxjs';
import { TaskDialogCloseMessage } from './model/task-dialog-close-message.model';
import { TaskModel } from './model/task.model';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TodoListService } from './todo-list.service';
import { ToggleButtonGroupComponent } from '../../shared/components/toggle-button-group/toggle-button-group.component';
import { ToggleButtonComponent } from '../../shared/components/toggle-button-group/toggle-button/toggle-button.component';
import { FormsModule } from '@angular/forms';
import { Button, IconComponent, IconEnum } from '@ui';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, ToggleButtonGroupComponent, ToggleButtonComponent, FormsModule, Button, IconComponent],
  providers: [TodoListService]
})
export class TodoListComponent implements OnInit {
  protected readonly IconEnum = IconEnum;

  readonly #service = inject(TodoListService);
  readonly #dialog = inject(Dialog);
  readonly #tasks = signal<TaskModel[]>([]);
  readonly #loading = signal<boolean>(true);

  public readonly contentViewMode = signal<'in-progress' | 'completed'>('in-progress');
  public readonly activeTasks = computed(() => this.#tasks().filter(t => !t.completed));
  public readonly completedTasks = computed(() => this.#tasks().filter(t => t.completed));
  public readonly loading = this.#loading.asReadonly();

  public ngOnInit(): void {
    this.loadTasks();
  }

  public loadTasks(): void {
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

  public changeView(value: 'in-progress' | 'completed'): void {
    this.contentViewMode.set(value);
  }

  public openDialog(id?: ID): void {
    const dialogRef = this.#dialog.open<TaskDialogCloseMessage>(TaskDialogComponent, {
      data: { id },
      width: '600px'
    });

    dialogRef.closed
      .pipe(take(1), filter(Boolean))
      .subscribe((message: TaskDialogCloseMessage) => this.handleDialogClose(message));
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
