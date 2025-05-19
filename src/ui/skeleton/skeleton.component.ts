import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: '',
  host: {
    '[style.width]': `width()`,
    '[style.height]': `height()`,
    '[style.borderRadius]': `borderRadius()`
  },
  styleUrl: './skeleton.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  public readonly width = input<string>('100%');
  public readonly height = input<string>('16px');
  public readonly borderRadius = input<string>('4px');
}
