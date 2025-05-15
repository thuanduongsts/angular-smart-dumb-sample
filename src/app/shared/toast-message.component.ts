import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast-message',
  template: `
    <div class="toast">
      {{ message }}
    </div>
  `,
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
export class ToastMessageComponent {
  @Input() message = '';
}
