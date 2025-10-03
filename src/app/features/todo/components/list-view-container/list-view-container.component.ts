import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-list-view-container',
  template: `<ng-content />`,
  styles: `
    :host
      margin-top: 24px
      display: flex
      flex-direction: column
      gap: 24px
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListViewContainerComponent {}
