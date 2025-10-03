import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import {
  Button,
  CardModule,
  IconComponent,
  IconEnum,
  TagComponent,
  TagStatusColorModel,
  TypographyComponent
} from '@ui';

import { TaskPriorityDirective } from '../../directives/task-priority.directive';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.sass',
  imports: [IconComponent, TypographyComponent, TagComponent, Button, TaskPriorityDirective, CardModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskComponent {
  protected readonly IconEnum = IconEnum;
  protected readonly tagColor = computed<TagStatusColorModel>(() => {
    switch (this.status()) {
      case 'Todo':
        return 'secondary';
      case 'In Progress':
        return 'primary';
      default:
        return 'success';
    }
  });

  public readonly title = input.required<string>();
  public readonly priority = input.required<TaskPriority>();
  public readonly status = input.required<TaskStatus>();
  public readonly description = input<string>();
  public readonly onEdit = output<void>();
  public readonly onRemove = output<void>();

  protected edit(): void {
    this.onEdit.emit();
  }

  protected remove(): void {
    this.onRemove.emit();
  }
}
