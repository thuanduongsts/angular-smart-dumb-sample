import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCarouselPrevButton]',
  standalone: true
})
export class CarouselPrevButtonDirective {
  public constructor(public templateRef: TemplateRef<{ isDisabled: boolean }>) {}
}
