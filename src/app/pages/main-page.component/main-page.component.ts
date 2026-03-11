import { Component } from '@angular/core';

import { ArcgisMapComponent } from '../../map-library/arcgis-map/arcgis-map.component';

@Component({
  selector: 'app-main-page',
  imports: [ArcgisMapComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {}
