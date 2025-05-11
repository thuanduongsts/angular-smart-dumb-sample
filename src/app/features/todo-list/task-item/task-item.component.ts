import { Component, input, output } from '@angular/core';
import { Task } from '@core/task.model';
import { ButtonComponent } from '../../../../ui/button/button.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.sass',
  imports: [ButtonComponent],
})
export class TaskItemComponent {
  public readonly task = input<Task>();
  public readonly toggleCompleted = output<void>();
  public readonly toggleImportant = output<void>();
  public readonly edit = output<void>();
} 