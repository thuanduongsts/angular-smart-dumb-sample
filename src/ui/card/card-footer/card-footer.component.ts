import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-card-footer',
  template: `<ng-content />`,
  styleUrl: './card-footer.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardFooterComponent {}
