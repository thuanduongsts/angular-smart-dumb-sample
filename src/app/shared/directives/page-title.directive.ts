import { Directive, HostBinding, input } from '@angular/core';

@Directive({
  selector: 'h1[appPageTitle]'
})
export class PageTitleDirective {
  public readonly color = input<string>('#1F2937');

  @HostBinding('style')
  get statusStyle(): Record<string, string> {
    return {
      color: this.color(),
      'margin-bottom': '24px',
      'font-size': '57px',
      'font-weight': '400',
      'letter-spacing': '-0.25px',
      'line-height': '64px',
      'font-family': 'Minion Pro, sans-serif'
    };
  }
}
