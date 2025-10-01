import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { IconComponent, IconEnum, TagComponent, TagStatusColorModel, TypographyComponent } from '@ui';
import { NgClass } from '@angular/common';

import { TaskModel } from '../../model/task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
  imports: [IconComponent, NgClass, TypographyComponent, TagComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  protected readonly IconEnum = IconEnum;
  protected readonly tagColor = computed<TagStatusColorModel>(() => {
    switch (this.task().status) {
      case 'Todo':
        return 'secondary';
      case 'In Progress':
        return 'primary';
      default:
        return 'success';
    }
  });

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
