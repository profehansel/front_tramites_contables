import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// Preset propio sobre Aura: paleta verde azulado en vez del celeste
// por defecto, para que se sienta como un panel de contador y no como
// una plantilla generica de PrimeNG.
const TramitesPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{app-primary.100}',
      100: '{app-primary.100}',
      200: '#c3e4d8',
      300: '#95d0b8',
      400: '#4faf8a',
      500: '#17916f',
      600: '#13795c',
      700: '#0f6e5d',
      800: '#0c584a',
      900: '#0b3d3a',
      950: '#072623',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        preset: TramitesPreset,
        options: {
          darkModeSelector: false,
          cssLayer: {
            name: 'primeng',
            order: 'reset, primeng',
          },
        },
      },
    }),
  ],
};
