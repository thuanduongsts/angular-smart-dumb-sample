import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SkeletonComponent } from '@ui';

@Component({
  selector: 'app-task-list',
  imports: [SkeletonComponent],
  template: `
    @if (isLoading()) {
      @for (_ of [].constructor(2); track $index) {
        <app-skeleton height="140px" />
      }
    } @else {
      <ng-content select="app-task" />
    }
  `,
  styleUrl: './task-list.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskListComponent {
  public readonly isLoading = input<boolean, StrOrBool>(false, { transform: booleanAttribute });
}
