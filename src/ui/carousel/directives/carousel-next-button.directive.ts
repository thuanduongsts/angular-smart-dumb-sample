import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCarouselNextButton]',
  standalone: true
})
export class CarouselNextButtonDirective {
  public constructor(public templateRef: TemplateRef<{ isDisabled: boolean }>) {}
}
