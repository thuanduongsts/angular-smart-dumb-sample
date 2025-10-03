import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnChanges,
  signal,
  SimpleChanges
} from '@angular/core';

import { isStatusColor } from '../../core/color/color';
import { TagStatusColorModel } from '../../misc/tag/models/tag-status-color.model';

@Component({
  selector: 'app-tag',
  template: `<ng-content />`,
  styleUrl: './tag.component.sass',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.background-color]': `isStatusColor() ? '' : color()`,
    '[class.tag-has-custom-color]': `color() && !isStatusColor()`
  }
})
export class TagComponent implements OnChanges {
  readonly #element: HTMLElement = inject(ElementRef<HTMLElement>).nativeElement;
  readonly #isStatusColor = signal(false);

  protected readonly isStatusColor = this.#isStatusColor.asReadonly();

  public readonly color = input<TagStatusColorModel | string>('default');

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['color']) {
      this.#setColor();
    }
  }

  #setColor(): void {
    this.#isStatusColor.set(isStatusColor(this.color()));
    if (this.#isStatusColor()) {
      this.#element.classList.add(`tag-status-${this.color()}`);
    }
  }
}
