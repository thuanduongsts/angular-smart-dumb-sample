import { ChangeDetectionStrategy, Component, HostBinding, input, numberAttribute } from '@angular/core';

@Component({
  selector: 'app-loading-icon',
  template: '',
  styles: `
    :host
      border: 2px solid #F3F3F352
      border-radius: 50%
      border-top: 2px solid #9CA3AF
      width: 20px
      height: 20px
      animation: spin 2s linear infinite

    @keyframes spin
      0%
        transform: rotate(0deg)

      100%
        transform: rotate(360deg)
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingIconComponent {}
