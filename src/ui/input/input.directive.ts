import { Directive } from '@angular/core';

@Directive({
  selector: 'input[appCusInput], textarea[appCusInput]',
  host: {
    class: 'cus-input'
  }
})
export class InputDirective {}
