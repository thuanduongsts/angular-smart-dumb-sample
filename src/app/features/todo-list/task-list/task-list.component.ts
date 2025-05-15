import { Component, input, output } from '@angular/core';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskModel } from '../model/task.model';
import { SkeletonComponent } from '../../../../ui/skeleton/skeleton.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass',
  imports: [TaskItemComponent, SkeletonComponent]
})
export class TaskListComponent {
  public readonly tasks = input<TaskModel[]>([]);
  public readonly loading = input<boolean>(false);
  public readonly toggleCompleted = output<ID>();
  public readonly toggleImportant = output<ID>();
  public readonly edit = output<ID>();
}
