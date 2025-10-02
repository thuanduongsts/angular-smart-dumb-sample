import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-title',
  template: `<h3><ng-content /></h3>`,
  styleUrl: './card-title.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardTitleComponent {}
