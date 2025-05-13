import { Injectable, Injector } from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ToastMessageComponent } from './toast-message.component';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private overlay: Overlay, private injector: Injector) {}

  show(message: string, duration = 3000) {
    const overlayRef = this.createOverlay();
    const toastPortal = new ComponentPortal(ToastMessageComponent);
    const toastRef = overlayRef.attach(toastPortal);

    toastRef.instance.message = message;

    setTimeout(() => overlayRef.dispose(), duration);
  }

  private createOverlay(): OverlayRef {
    const config = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .global()
        .right('20px')
        .top('20px'),
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      hasBackdrop: false,
      panelClass: 'toast-panel'
    });

    return this.overlay.create(config);
  }
}