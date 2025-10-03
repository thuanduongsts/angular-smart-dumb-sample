import { Dialog } from '@angular/cdk/dialog';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Button,
  IconComponent,
  IconEnum,
  SelectItemModel,
  SkeletonComponent,
  ToastService,
  TypographyComponent
} from '@ui';
import { TaskStatuses } from '@common/constants/task-statuses.constant';
import { SortDirectionOptions } from '@shared/constant/sort-options.constant';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  distinct,
  EMPTY,
  filter,
  finalize,
  map,
  mergeMap,
  startWith,
  Subject,
  switchMap
} from 'rxjs';

import { ListViewContainerComponent } from './components/list-view-container/list-view-container.component';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { DefaultFilter } from './constants/default-filter.constant';
import { TaskComponent } from './components/task/task.component';
import { FilterModel } from './components/filter/filter.model';
import { FilterComponent } from './components/filter/filter.component';
import { TaskModel } from './model/task.model';
import { TodoService } from './services/todo.service';

@Component({
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    Button,
    IconComponent,
    TaskComponent,
    FilterComponent,
    ListViewContainerComponent,
    TypographyComponent,
    ReactiveFormsModule,
    SkeletonComponent
  ],
  providers: [TodoService]
})
export class TodoComponent implements OnInit {
  readonly #triggerFetchTasks$ = new BehaviorSubject<void>(undefined);
  readonly #removeTask$ = new Subject<TaskModel>();
  readonly #tasks = signal<TaskModel[]>([]);
  readonly #isLoading = signal<boolean>(true);

  protected readonly IconEnum = IconEnum;
  protected readonly filterControl = new FormControl<FilterModel>(DefaultFilter, { nonNullable: true });
  protected readonly statusOptions = signal<TaskStatus[]>(TaskStatuses).asReadonly();
  protected readonly sortOptions = signal<SelectItemModel[]>(SortDirectionOptions).asReadonly();
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
      width: '600px',
      disableClose: true
    });

    dialogRef.closed.pipe(filter(Boolean)).subscribe({
      next: () => this.#triggerFetchTasks$.next()
    });
  }

  protected removeTask(task: TaskModel): void {
    this.#removeTask$.next(task);
  }

  #setupTasks(): void {
    combineLatest([
      this.filterControl.valueChanges.pipe(startWith(this.filterControl.getRawValue())),
      this.#triggerFetchTasks$
    ])
      .pipe(
        switchMap(([filter]) => {
          this.#tasks.set([]);
          this.#isLoading.set(true);
          return this.todoService.getTasks(filter).pipe(finalize(() => this.#isLoading.set(false)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
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
