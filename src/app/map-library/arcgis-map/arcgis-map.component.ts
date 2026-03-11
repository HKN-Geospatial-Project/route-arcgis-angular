import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  NgZone,
  Output,
  EventEmitter,
} from '@angular/core';

import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import ElevationLayer from '@arcgis/core/layers/ElevationLayer';

export interface ClickedCoordinate {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  elevation: number | undefined;
  x: number;
  y: number;
}

@Component({
  selector: 'map-arcgis',
  standalone: true,
  imports: [],
  templateUrl: './arcgis-map.component.html',
  styleUrls: ['./arcgis-map.component.css'],
})
export class ArcgisMapComponent implements OnInit, OnDestroy {
  @ViewChild('mapViewNode', { static: true }) private mapViewEl!: ElementRef;

  @Output() mapClicked = new EventEmitter<ClickedCoordinate>();

  private view!: MapView;

  constructor(private zone: NgZone) {}

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

    // Defining the elevation service
    const elevationLayer = new ElevationLayer({
      url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
    });

    this.view.on('click', async (event) => {
      try {
        // Query the elevation first
        const result = await elevationLayer.queryElevation(event.mapPoint);
        const elevation = result.geometry.z;

        // Bundle all the data into our interface payload
        const payload: ClickedCoordinate = {
          latitude: event.mapPoint.latitude ?? undefined,
          longitude: event.mapPoint.longitude ?? undefined,
          elevation: elevation !== undefined ? elevation : undefined,
          x: event.x,
          y: event.y,
        };

        this.zone.run(() => {
          this.mapClicked.emit(payload);
        });
      } catch (error) {
        console.error('Failed to query coordinates:', error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.view) {
      this.view.destroy();
    }
  }
}
