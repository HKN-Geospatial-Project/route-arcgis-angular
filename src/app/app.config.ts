import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MapEventProviderService } from './map-library/abstract/services/map-event-provider.service';
import { ArcGISMapEventProviderService } from './map-library/arcgis-map/services/arcgis-map-event-provider.service';
import { RouteGraphicsService } from './map-library/abstract/services/route-map-graphics.service';
import { ArcGISRouteGraphicsService } from './map-library/arcgis-map/services/arcgis-route-map-graphics.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch()),
    provideAnimations(),
    provideToastr(),
    provideRouter(routes),
    {
      provide: MapEventProviderService,
      useClass: ArcGISMapEventProviderService,
    },
    {
      provide: RouteGraphicsService,
      useClass: ArcGISRouteGraphicsService,
    },
  ],
};
