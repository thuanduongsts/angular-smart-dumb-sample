import { Component, input, output } from '@angular/core';

import { TaskModel } from '../model/task.model';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.sass'
})
export class TaskItemComponent {
  public readonly task = input<TaskModel>();
  public readonly toggleCompleted = output<void>();
  public readonly toggleImportant = output<void>();
  public readonly edit = output<void>();
}
