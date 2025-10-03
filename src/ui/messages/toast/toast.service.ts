import { Injectable } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { ToastComponent } from './toast.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private overlay: Overlay) {}

  public show(message: string, duration = 3000): void {
    const overlayRef = this.createOverlay();
    const toastPortal = new ComponentPortal(ToastComponent);
    const toastRef = overlayRef.attach(toastPortal);

    toastRef.setInput('message', message);

    setTimeout(() => overlayRef.dispose(), duration);
  }

  private createOverlay(): OverlayRef {
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global().right('20px').top('20px'),
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      hasBackdrop: false,
      panelClass: 'toast-panel'
    });

    return this.overlay.create(config);
  }
}
