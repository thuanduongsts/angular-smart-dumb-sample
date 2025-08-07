import { Dialog } from '@angular/cdk/dialog';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Button, IconComponent, IconEnum, SkeletonComponent } from '@ui';
import { PageTitleDirective } from '@shared/directives/page-title.directive';
import { ToastService } from '@shared/toast.service';
import { catchError, distinct, EMPTY, filter, finalize, map, mergeMap, Subject } from 'rxjs';

import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { TaskComponent } from './task/task.component';
import { TaskModel } from './model/task.model';
import { TodoService } from './services/todo.service';

@Component({
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, Button, IconComponent, PageTitleDirective, TaskComponent, SkeletonComponent],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  readonly #removeTask$ = new Subject<TaskModel>();
  readonly #tasks = signal<TaskModel[]>([]);
  readonly #isLoading = signal<boolean>(true);

  protected readonly IconEnum = IconEnum;
  protected readonly tasks = this.#tasks.asReadonly();
  protected readonly isLoading = this.#isLoading.asReadonly();

  public constructor(
    private destroyRef: DestroyRef,
    private dialog: Dialog,
    private todoService: TodoService,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.#setupTasks();
    this.#setupRemoveTaskStream();
  }

  protected openTaskDialog(taskId: ID = ''): void {
    const dialogRef = this.dialog.open<boolean>(TaskDialogComponent, {
      data: taskId,
      width: '600px'
    });

    dialogRef.closed.pipe(filter(Boolean)).subscribe(() => this.#setupTasks());
  }

  protected removeTask(task: TaskModel): void {
    this.#removeTask$.next(task);
  }

  #setupTasks(): void {
    this.#isLoading.set(true);
    this.todoService
      .getTasks()
      .pipe(finalize(() => this.#isLoading.set(false)))
      .subscribe({
        next: tasks => this.#tasks.set(tasks)
      });
  }

  #setupRemoveTaskStream(): void {
    this.#removeTask$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        distinct(task => task.id),
        mergeMap(task =>
          this.todoService.deleteTask(task.id).pipe(
            map(() => task.id),
            catchError(() => {
              this.toastService.show(`Failed to delete task: ${task.title}`);
              return EMPTY;
            })
          )
        )
      )
      .subscribe({
        next: id => this.#tasks.update(tasks => tasks.filter(t => t.id !== id))
      });
  }
}
