import { Component, input } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: ` <section class="toast">{{ message() }}</section> `,
  styles: [
    `
      .toast
        background: white
        color: black
        padding: 12px 20px
        border-radius: 6px
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3)
        font-size: 14px
        max-width: 300px
    `
  ]
})
export class ToastComponent {
  public readonly message = input<string>();
}
