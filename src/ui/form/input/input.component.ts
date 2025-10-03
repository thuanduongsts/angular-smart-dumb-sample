import { Component } from '@angular/core';

@Component({
  selector: 'input[appCusInput], textarea[appCusInput]',
  template: ` <ng-content /> `,
  styleUrl: './input.component.sass'
})
export class InputComponent {}
