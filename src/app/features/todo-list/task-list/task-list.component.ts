import { Component, input, output } from '@angular/core';
import { Task } from '@core/task.model';
import { TaskItemComponent } from '../task-item/task-item.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.sass',
  imports: [TaskItemComponent],
})
export class TaskListComponent {
  public readonly tasks = input<Task[]>([]);
  public readonly toggleCompleted = output<number>();
  public readonly toggleImportant = output<number>();
  public readonly edit = output<number>();
} 