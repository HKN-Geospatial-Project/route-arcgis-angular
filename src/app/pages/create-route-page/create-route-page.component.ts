import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import {
  ArcgisMapComponent,
  ClickedCoordinate,
} from '../../map-library/arcgis-map/arcgis-map.component';
import {
  RoutePointListComponent,
  RoutePointListItem,
} from '../../components/route-point-list/route-point-list.component';
import { CoordinateUtils } from '../../utils/coordinate.utils';

@Component({
  selector: 'create-route-page',
  standalone: true,
  imports: [CommonModule, FormsModule, ArcgisMapComponent, RoutePointListComponent],
  templateUrl: './create-route-page.component.html',
  styleUrls: ['./create-route-page.component.css'],
})
export class CreateRoutePageComponent {
  constructor(private router: Router) {}
  // --- State Variables ---
  public routeName: string = '';
  public pointList: RoutePointListItem[] = [];

  // Variables to hold the manual input values before they are added
  public manualLat: number | null | undefined = null;
  public manualLon: number | null | undefined = null;

  // --- Methods ---

  // 1. Triggered when the map framework emits a click event
  public onMapClick(clickedCoordinate: ClickedCoordinate): void {
    this.manualLat = clickedCoordinate.latitude;
    this.manualLon = clickedCoordinate.longitude;
  }

  // 2. Triggered by the "Add Point" button in the manual entry form
  public addManualPoint(): void {
    const mappedCoordinate: RoutePointListItem = {
      latitude: this.manualLat,
      longitude: this.manualLon,
    };

    this.pointList.push(mappedCoordinate);
    console.log(this.pointList);
  }

  // 3. Triggered by the "Save" button
  public saveRoute(): void {
    console.log('saveRoute');
  }

  // 4. Triggered by the "Reset" button
  public resetRoute(): void {
    this.pointList = [];
  }

  // 5. Triggered by the "Back" button
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }

  public onListPointEdited(event: { index: number; updatedPoint: RoutePointListItem }) {
    const newArray = [...this.pointList];
    newArray[event.index] = event.updatedPoint;

    // Reassigning the array triggers the Map to redraw automatically!
    this.pointList = newArray;
  }

  // Triggered when the list component emits a delete action
  public onListPointDeleted(index: number): void {
    // Array.filter creates a brand new array, keeping everything EXCEPT the given index
    this.pointList = this.pointList.filter((_, i) => i !== index);
  }

  // Triggered when the list component emits a move action (Up or Down)
  public onListPointMoved(event: { oldIndex: number; newIndex: number }): void {
    // 1. Create a shallow copy of the array
    const newArray = [...this.pointList];

    // 2. Remove the item from its old position
    const [movedItem] = newArray.splice(event.oldIndex, 1);

    // 3. Insert the item into its new position
    newArray.splice(event.newIndex, 0, movedItem);

    // 4. Reassign the array to trigger Angular's change detection for the Map
    this.pointList = newArray;
  }

  public get isManualAddValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.manualLat, this.manualLon);
  }
}
