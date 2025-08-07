import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: 'h3[appSectionTitle]'
})
export class SectionTitleDirective {
  public readonly color = input<string>('#1F2937');

  @HostBinding('style')
  get statusStyle(): Record<string, string> {
    return {
      color: this.color(),
      'font-size': '36px',
      'font-weight': '400',
      'line-height': '44px',
      'font-family': 'Minion Pro, sans-serif'
    };
  }
}
