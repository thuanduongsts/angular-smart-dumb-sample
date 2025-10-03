import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  contentChildren,
  DestroyRef,
  ElementRef,
  Inject,
  input,
  model,
  output,
  Renderer2,
  signal,
  viewChild
} from '@angular/core';
import { ResponsiveScreen } from '@common/constants/responsive-screen.constant';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { IconComponent } from '../icon/icon.component';
import { IconEnum } from '../icon/icon.enum';
import { CarouselResponsiveOptionModel } from './models/carousel-responsive-option.model';
import { CarouselNextButtonDirective } from './directives/carousel-next-button.directive';
import { CarouselPrevButtonDirective } from './directives/carousel-prev-button.directive';
import { CarouselItemDirective } from './directives/carousel-item.directive';
import { ScrollTrackerDirective } from '../directives/scroll-tracker.directive';
import { WINDOW } from '@common/tokens/window.constant';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.sass',
  imports: [NgTemplateOutlet, IconComponent, ScrollTrackerDirective],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarouselComponent implements AfterViewInit {
  readonly #totalShiftItems = signal<number>(0);
  readonly #currentIndex = signal<number>(0);

  public readonly iconEnum = IconEnum;
  public readonly columnGapInPx = 24;
  public readonly isFadeEnabled = input(false);
  public readonly nextButtonTemplate = contentChild<CarouselNextButtonDirective>(CarouselNextButtonDirective);
  public readonly prevButtonTemplate = contentChild<CarouselPrevButtonDirective>(CarouselPrevButtonDirective);
  public readonly carouselItems = contentChildren<CarouselItemDirective>(CarouselItemDirective);
  public readonly carouselTrack = viewChild<ElementRef<HTMLElement>>('track');
  public readonly responsiveOptions = input<Maybe<CarouselResponsiveOptionModel[]>>(undefined);
  public readonly totalItems = input.required<number>();
  public readonly isLoading = input.required<boolean>();
  public readonly numVisible = model<number>(3);
  public readonly isBackDisabled = computed(() => this.isLoading() || this.#currentIndex() === this.numVisible() - 1);
  public readonly isNextDisabled = computed(() => this.isLoading() || this.#currentIndex() === this.totalItems() - 1);
  public readonly isMobile = signal<boolean>(false);
  public readonly loadMore = output<void>();

  private _defaultNumVisible = this.numVisible();

  get carouselTrackElement(): HTMLDivElement {
    return this.carouselTrack()!.nativeElement as HTMLDivElement;
  }

  public constructor(
    @Inject(WINDOW) private window: Window,
    private destroyRef: DestroyRef,
    private render2: Renderer2
  ) {}

  public ngAfterViewInit(): void {
    this.#currentIndex.set(this.numVisible() - 1);

    fromEvent(this.window, 'resize')
      .pipe(startWith(undefined), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.isMobile.set(this.window.innerWidth <= ResponsiveScreen.MD);
        this.#calculatePosition();
      });
  }

  public scrollForward(): void {
    this.#updateCurrentItemDisplay('next');
    this.#updateTranslateLeftStyle();
    if (this.#currentIndex() > this.carouselItems().length - 1) {
      this.loadMore.emit();
    }
  }

  public scrollBackward(): void {
    this.#updateCurrentItemDisplay('back');
    this.#updateTranslateLeftStyle();
  }

  #calculatePosition(): void {
    const responsiveOptions = this.responsiveOptions();

    if (responsiveOptions) {
      let responsiveNumVisible = this._defaultNumVisible;

      responsiveOptions.forEach(option => {
        if (parseInt(option.breakpoint, 10) >= this.window.innerWidth) {
          responsiveNumVisible = option.numVisible;
        }
      });

      if (this.numVisible() !== responsiveNumVisible) {
        this.numVisible.set(responsiveNumVisible);

        this.#currentIndex.set(this.numVisible() - 1);
        this.#totalShiftItems.set(0);
      }
    }

    this.#updateGridColumnStyle();
    if (!this.isMobile()) {
      this.#updateTranslateLeftStyle();
    }
  }

  #updateGridColumnStyle(): void {
    const numVisibleNeedGap = this.numVisible() - 1;
    const carouselItemWidth = `calc((100% - ${numVisibleNeedGap * this.columnGapInPx}px) / ${this.numVisible()})`;
    this.render2.setStyle(this.carouselTrackElement, 'grid-auto-columns', carouselItemWidth);
  }

  #updateTranslateLeftStyle(): void {
    const carouselItemOffsetWidth = (this.carouselTrack()?.nativeElement.firstChild as HTMLDivElement).offsetWidth || 0;
    const translateLeftInPx = this.#totalShiftItems() * (carouselItemOffsetWidth + this.columnGapInPx);
    this.render2.setStyle(this.carouselTrackElement, 'transform', `translateX(-${translateLeftInPx}px`);
  }

  #updateCurrentItemDisplay(action: 'next' | 'back'): void {
    const isNext = action === 'next';
    const atEnd = this.#currentIndex() === this.totalItems() - 1;
    const atStart = this.#currentIndex() === this.numVisible() - 1;

    if ((isNext && atEnd) || (!isNext && atStart)) {
      return;
    }

    const delta = isNext ? 1 : -1;
    this.#currentIndex.update(count => count + delta);
    this.#totalShiftItems.update(count => count + delta);
  }

  public onLoadMore(): void {
    if (this.totalItems() > this.carouselItems().length) {
      this.loadMore.emit();
    }
  }
}
