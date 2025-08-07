import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appCustomSelectedValues]'
})
export class CustomSelectedValuesDirective {
  public constructor(public templateRef: TemplateRef<{ values: string[] }>) {}
}
