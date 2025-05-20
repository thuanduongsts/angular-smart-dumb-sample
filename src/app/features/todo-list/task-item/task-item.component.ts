import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Button, IconComponent, IconEnum } from '@ui';

import { TaskModel } from '../model/task.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.sass',
  imports: [Button, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskItemComponent {
  public readonly IconEnum = IconEnum;
  public readonly task = input.required<TaskModel>();
  public readonly clickedTitle = output<void>();
  public readonly clickedImportantButton = output<void>();
  public readonly clickedDeleteButton = output<void>();

  public handleClickTitle(): void {
    this.clickedTitle.emit();
  }

  public handleClickImportant(): void {
    this.clickedImportantButton.emit();
  }

  public handleClickDelete(): void {
    this.clickedDeleteButton.emit();
  }
}
