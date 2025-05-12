import { Component, input, output } from '@angular/core';
import { TaskModel } from 'src/app/common/models/task.model';
import { ButtonComponent } from '../../../../ui/button/button.component';

@Component({
  selector: 'app-task-item',
  standalone: true,
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.sass',
  imports: [ButtonComponent],
})
export class TaskItemComponent {
  public readonly task = input<TaskModel>();
  public readonly toggleCompleted = output<void>();
  public readonly toggleImportant = output<void>();
  public readonly edit = output<void>();
}
