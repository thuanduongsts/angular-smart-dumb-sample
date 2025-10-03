import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-sub-title',
  template: `<ng-content />`,
  styleUrl: './card-sub-title.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardSubTitleComponent {}
