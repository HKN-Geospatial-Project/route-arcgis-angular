import { Component } from '@angular/core';

import {
  ArcgisMapComponent,
  ClickedCoordinate,
} from '../../map-library/arcgis-map/arcgis-map.component';
import {
  CoordinateListComponent,
  CoordinateListItem,
} from '../../components/coordinate-list/coordinate-list.component';

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [ArcgisMapComponent, CoordinateListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  public coordinateList: CoordinateListItem[] = [];

  public handleMapClick(clickedPoint: ClickedCoordinate): void {
    const mappedCoordinate: CoordinateListItem = {
      latitude: clickedPoint.latitude,
      longitude: clickedPoint.longitude,
      elevation: clickedPoint.elevation,
    };

    this.coordinateList.push(mappedCoordinate);
  }
}
