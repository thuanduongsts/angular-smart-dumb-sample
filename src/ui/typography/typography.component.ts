import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'h1[cusTitle], h2[cusTitle], h3[cusTitle], h4[cusTitle], p[cusParagraph]',
  template: `<ng-content />`,
  styleUrl: './typography.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TypographyComponent {}
