import { ApplicationConfig, PLATFORM_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { TaskApi } from '@core/task.api';
import { WINDOW } from '@common/tokens/window.constant';

import { routes } from './app.routes';

function windowFactory(platformId: Record<string, unknown>): Window {
  return <Window>(isPlatformBrowser(platformId) ? window : {});
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    TaskApi,
    {
      provide: WINDOW,
      useFactory: windowFactory,
      deps: [PLATFORM_ID]
    }
  ]
};
