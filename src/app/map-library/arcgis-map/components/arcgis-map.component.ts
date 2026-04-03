// Angular Core Imports
import { Component, ElementRef, OnInit, ViewChild, OnDestroy, NgZone, inject } from '@angular/core';

// ArcGIS Core Imports
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';

// Application Imports
import { ClickedPointEvent } from '../../models/event/clicked-point.event';
import { MapEventProviderService } from '../../abstract/services/map-event-provider.service';
import { RouteGraphicsService } from '../../abstract/services/route-map-graphics.service';

/**
 * Core component responsible for initializing and managing the ArcGIS Map and MapView.
 * It handles the lifecycle of the map engine, captures user interactions,
 * and bridges the third-party ArcGIS API with Angular's reactive ecosystem.
 */
@Component({
  selector: 'map-arcgis',
  standalone: true,
  imports: [],
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css'],
})
export class ArcgisMapComponent implements OnInit, OnDestroy {
  /** Reference to the DOM element where the ArcGIS MapView will be rendered. */
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  /** The ArcGIS MapView instance. */
  private view: MapView | null = null;

  /** Angular Zone service used to run code inside/outside Angular's change detection. */
  private zone = inject(NgZone);

  /** Service used to broadcast map events to the rest of the application. */
  private mapEventService = inject(MapEventProviderService);

  /** Service used to manage Route graphical overlays on the map. */
  private routeGraphicsService = inject(RouteGraphicsService);

  /** Initializes the map rendering process once the component is ready. */
  ngOnInit(): void {
    this.initializeMap();
  }

  private async initializeMap(): Promise<void> {
    const map = new Map({
      basemap: 'topo-vector',
    });

    this.view = new MapView({
      container: this.mapViewEl.nativeElement,
      map: map,
      center: [-81.20681742456736, 28.485906479717393],
      zoom: 12,
    });

    // Registers this view instance with the graphics service for route drawing.
    this.routeGraphicsService.registerView(this.view);

    // Defining the elevation service
    const elevationLayer = new ElevationLayer({
      url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
    });

    // Listens for click events on the MapView.
    this.view.on('click', async (event) => {
      try {
        // Query the elevation first
        //const result = await elevationLayer.queryElevation(event.mapPoint);
        //const elevation = result.geometry.z;
        const elevation = undefined;

        // Bundle all the data into our interface payload
        const payload: ClickedPointEvent = {
          latitude: event.mapPoint.latitude != null ? event.mapPoint.latitude : null,
          longitude: event.mapPoint.longitude != null ? event.mapPoint.longitude : null,
          altitude: elevation != null ? elevation : null,
          x: event.x,
          y: event.y,
        };

        // Ensures the event emission runs inside Angular's Zone to trigger UI updates.
        this.zone.run(() => {
          this.mapEventService.emitMapClick(payload);
        });
      } catch (error) {
        console.error('Failed to query coordinates:', error);
      }
    });
  }

  /**
   * Cleanup phase. Destroys the MapView to prevent WebGL memory leaks
   * and releases resources used by the ArcGIS API.
   */
  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
