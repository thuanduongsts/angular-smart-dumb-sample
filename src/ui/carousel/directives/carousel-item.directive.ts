import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCarouselItem]',
  standalone: true
})
export class CarouselItemDirective {
  public constructor(public templateRef: TemplateRef<unknown>) {}
}
