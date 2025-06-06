import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { TaskApi } from '@core/task.api';
import { ToastService } from './shared/toast.service';

import { routes } from './app.routes';
import { isPlatformBrowser } from '@angular/common';
import { WINDOW } from '@common/tokens/window.constant';

function windowFactory(platformId: Record<string, unknown>): Window {
  return <Window>(isPlatformBrowser(platformId) ? window : {});
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    TaskApi,
    ToastService,
    {
      provide: WINDOW,
      useFactory: windowFactory,
      deps: [PLATFORM_ID]
    }
  ]
};
