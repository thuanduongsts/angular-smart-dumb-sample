import { booleanAttribute, Component, input, output } from '@angular/core';
import { SkeletonComponent } from '@ui';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskModel } from '../model/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass',
  imports: [TaskItemComponent, SkeletonComponent],
  standalone: true
})
export class TaskListComponent {
  public readonly tasks = input.required<TaskModel[]>();
  public readonly loading = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
  public readonly clickedTitle = output<ID>();
  public readonly clickedDeleteButton = output<ID>();
  public readonly clickedImportantButton = output<ID>();
}
