import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { IconComponent, IconEnum } from '@ui';
import { NgClass } from '@angular/common';
import { TaskStatusDirective } from '@shared/directives/task-status.directive';

import { TaskModel } from '../model/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
  imports: [IconComponent, TaskStatusDirective, NgClass],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  protected readonly IconEnum = IconEnum;

  public readonly task = input.required<TaskModel>();
  public readonly taskEdit = output<void>();
  public readonly taskRemove = output<void>();

  protected edit(): void {
    this.taskEdit.emit();
  }

  protected remove(): void {
    this.taskRemove.emit();
  }
}
