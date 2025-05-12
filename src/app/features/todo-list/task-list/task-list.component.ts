import { Component, input, output } from '@angular/core';

import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskModel } from '../model/task.model';
import { SpinnerComponent } from '../../../../ui/spinner/spinner.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass',
  imports: [TaskItemComponent, SpinnerComponent]
})
export class TaskListComponent {
  public readonly tasks = input<TaskModel[]>([]);
  public readonly loading = input<boolean>(false);
  public readonly toggleCompleted = output<string>();
  public readonly toggleImportant = output<string>();
  public readonly edit = output<string>();
}
