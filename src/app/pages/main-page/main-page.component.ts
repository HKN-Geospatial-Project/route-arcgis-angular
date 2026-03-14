import { Component } from '@angular/core';
import { Router } from '@angular/router';

import {
  ArcgisMapComponent,
  ClickedCoordinate,
} from '../../map-library/arcgis-map/arcgis-map.component';

@Component({
  selector: 'main-page',
  standalone: true,
  imports: [ArcgisMapComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  constructor(private router: Router) {}

  public handleMapClick(clickedCoordinate: ClickedCoordinate): void {
    console.log(clickedCoordinate);
  }

  public navigateCreateRoutePage() {
    this.router.navigate(['/create-route-page']);
  }
}
