import { Component } from '@angular/core';

import { ArcgisMapComponent } from '../../map-library/arcgis-map/arcgis-map.component';
import { CoordinateListComponent } from '../../components/coordinate-list.component/coordinate-list.component';

@Component({
  selector: 'app-main-page',
  imports: [ArcgisMapComponent, CoordinateListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {}
