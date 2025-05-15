import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, inject, Input, Renderer2 } from '@angular/core';

import { IconEnum } from './icon.enum';

@Component({
  selector: 'app-icon',
  template: '',
  styleUrls: ['./icon.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  private render = inject(Renderer2);
  private elementRef = inject(ElementRef);

  @Input({ required: true }) set name(name: IconEnum) {
    if (name) {
      const imageUrl = `/assets/icons/${name}.svg`;

      this.render.setStyle(this.elementRef.nativeElement, 'mask-image', `url(${imageUrl})`);
      this.render.setStyle(this.elementRef.nativeElement, 'webkit-mask-image', `url(${imageUrl})`);
    }
  }

  @HostBinding('style.min-height.px')
  @HostBinding('style.min-width.px')
  @Input()
  public size: number = 24;
}
