import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-content',
  template: `<ng-content />`,
  styleUrl: './card-content.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardContentComponent {}
