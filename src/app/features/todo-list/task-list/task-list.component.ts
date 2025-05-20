import { booleanAttribute, Component, input, output } from '@angular/core';
import { SkeletonComponent } from '@ui';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskModel } from '../model/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass',
  imports: [TaskItemComponent, SkeletonComponent]
})
export class TaskListComponent {
  public readonly tasks = input.required<TaskModel[]>();
  public readonly loading = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly clickedTitle = output<ID>();
  public readonly clickedDeleteButton = output<TaskModel>();
  public readonly clickedImportantButton = output<TaskModel>();

  public handleClickTitle(id: ID): void {
    this.clickedTitle.emit(id);
  }

  public handleClickImportant(task: TaskModel): void {
    this.clickedImportantButton.emit(task);
  }

  public handleClickDelete(task: TaskModel): void {
    this.clickedDeleteButton.emit(task);
  }
}
