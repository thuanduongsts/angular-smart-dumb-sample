import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-header',
  template: `<ng-content select="app-card-title, app-card-sub-title" />`,
  styleUrl: './card-header.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardHeaderComponent {}
