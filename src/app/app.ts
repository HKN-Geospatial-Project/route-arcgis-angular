import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArcgisMapComponent } from './map-library/arcgis-map/components/arcgis-map.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ArcgisMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('GeospatialArcGISAngular');
}
