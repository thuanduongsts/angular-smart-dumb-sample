import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TaskModel } from '@common/models/task.model';
import { TodoListService } from './todo-list.service';
import { TaskListComponent } from './task-list/task-list.component';
import { Dialog } from '@angular/cdk/dialog';
import { ButtonComponent } from '@ui';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TaskListComponent, ButtonComponent],
  providers: [TodoListService]
})
export class TodoListComponent {
  public readonly tasks = signal<TaskModel[]>([]);

  public readonly activeTasks = computed(() => this.tasks().filter(t => !t.completed));
  public readonly completedTasks = computed(() => this.tasks().filter(t => t.completed));

  public constructor(
    private service: TodoListService,
    private dialogService: Dialog
  ) {
    this.reloadTasks();
  }

  public reloadTasks(): void {
    this.service.getTasks().subscribe(tasks => {
      this.tasks.set(tasks);
    });
  }

  public openDialog(data: Nullable<TaskModel>): void {
    const ref = this.dialogService.open(TaskDialogComponent, {
      data,
      width: '400px',
      disableClose: true
    });
    ref.closed.subscribe((result: any) => {
      if (!result) return;

      if (data) {
        //TODO: show toast or somethings...
        // if (taskId) {
        //   this.service.updateTask(taskId, result.data).subscribe(() => this.reloadTasks());
        // } else {
        //   const { id, ...body } = result.data;
        //   this.service.createTask(body).subscribe(() => this.reloadTasks());
        // }
      } else if (result.type === 'delete') {
        this.service.deleteTask(result.data).subscribe(() => this.reloadTasks());
      }
    });
  }

  public onToggleCompleted(id: number): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;
    this.service.updateCompleted(id, !task.completed).subscribe(() => this.reloadTasks());
  }

  public onToggleImportant(id: number): void {
    const task = this.tasks().find(t => t.id === id);
    if (!task) return;
    this.service.updateImportant(id, !task.important).subscribe(() => this.reloadTasks());
  }

  public onEditTask(id: number): void {
    this.service.getDetails(id).subscribe({ next: task => this.openDialog(task) });
  }
}
