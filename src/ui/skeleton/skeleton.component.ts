import { NgStyle } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [NgStyle],
  template: `
    <div
      class="skeleton-block shimmer"
      [ngStyle]="{
        width: width(),
        height: height(),
        borderRadius: borderRadius()
      }"
    ></div>
  `,
  styleUrl: './skeleton.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkeletonComponent {
  public readonly width = input<string>('100%');
  public readonly height = input<string>('16px');
  public readonly borderRadius = input<string>('4px');
}
