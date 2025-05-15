import { Directive, HostListener, input, output } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]',
  standalone: true
})
export class ScrollTrackerDirective {
  public readonly thresholdOffset = input(300);
  public readonly isHorizontal = input(false);

  public readonly scrolledToThreshold = output();

  @HostListener('scroll', ['$event'])
  onScroll(event: Event): void {
    if (this.isHorizontal()) {
      const target = event.target as HTMLElement;
      const rightReached = target.scrollWidth - target.scrollLeft <= target.clientWidth + this.thresholdOffset();

      if (rightReached) {
        this.scrolledToThreshold.emit();
      }
      return;
    }

    const target = event.target as HTMLElement;
    const bottomReached = target.scrollHeight - target.scrollTop <= target.clientHeight + this.thresholdOffset();
    if (bottomReached) {
      this.scrolledToThreshold.emit();
    }
  }
}
