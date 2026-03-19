import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MapEventProviderService } from './map-library/abstract/services/map-event-provider.service';
import { ArcGISMapEventProviderService } from './map-library/arcgis-map/services/arcgis-map-event-provider.service';
import { RouteGraphicsService } from './map-library/abstract/services/route-map-graphics.service';
import { ArcGISRouteGraphicsService } from './map-library/arcgis-map/services/arcgis-route-map-graphics.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
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
