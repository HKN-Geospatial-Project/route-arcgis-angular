// Angular Core Imports
import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Application Core Imports
import { ClickedCoordinate } from '../../map-library/models/clicked-coordinate.model';
import { CoordinateUtils } from '../../utils/coordinate.utils';
import { MapEventProviderService } from '../../map-library/abstract/services/map-event-provider.service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import {
  RoutePointListComponent,
  RoutePointListItem,
} from '../../components/route-point-list/route-point-list.component';

/**
 * Orchestrates the route creation workflow.
 */
@Component({
  selector: 'create-route-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RoutePointListComponent],
  templateUrl: './create-route-page.component.html',
  styleUrls: ['./create-route-page.component.css'],
})
export class CreateRoutePageComponent implements OnInit, OnDestroy {
  /** Subscription to the global map click event stream. Must be cleaned up on destroy. */
  private clickSubscription!: Subscription;

  /** Service for programmatic page navigation. */
  private router = inject(Router);

  /** Service that broadcasts clicks from the ArcGIS Map component. */
  private mapEventProviderService = inject(MapEventProviderService);

  /** Service responsible for drawing markers and lines on the map. */
  private routeService = inject(RouteGraphicsService);

  // --- State Variables ---

  /** The user-defined name for the route being created. */
  public routeName: string = '';

  /** The collection of points that make up the current route. */
  public pointList: RoutePointListItem[] = [];

  /** Reactive Signal for the latitude input. */
  public manualLat = signal<number | null | undefined>(null);

  /** Reactive Signal for the longitude input. */
  public manualLon = signal<number | null | undefined>(null);

  /**
   * Initializes the component by subscribing to map click events.
   */
  ngOnInit(): void {
    this.clickSubscription = this.mapEventProviderService.mapClicked$.subscribe(
      (clickedCoordinate: ClickedCoordinate) => {
        this.manualLat.set(clickedCoordinate.latitude);
        this.manualLon.set(clickedCoordinate.longitude);
      },
    );
  }

  /** Unsubscribes from map events to prevent memory leaks. */
  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }

  /**
   * Adds the current signal values to the local point list and
   * instructs the map service to render a new point/segment.
   */
  public addManualPoint(): void {
    this.pointList.push({
      latitude: this.manualLat(),
      longitude: this.manualLon(),
    });

    this.routeService.addPoint({
      latitude: this.manualLat(),
      longitude: this.manualLon(),
      altitude: undefined,
    });
  }

  public saveRoute(): void {
    console.log('saveRoute');
  }

  /** Resets the local state and clears all graphics from the map. */
  public resetRoute(): void {
    this.pointList = [];
    this.routeService.clearAll();
  }

  /** Navigates back to the main landing page. */
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }

  /**
   * Handles updates from the child list component when a point is edited.
   * Reassigns the array to trigger Angular's change detection.
   */
  public onListPointEdited(event: { index: number; updatedPoint: RoutePointListItem }) {
    const newArray = [...this.pointList];
    newArray[event.index] = event.updatedPoint;
    this.pointList = newArray;
  }

  /** Removes a point from the list based on its index. */
  public onListPointDeleted(index: number): void {
    this.pointList = this.pointList.filter((_, i) => i !== index);
  }

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

  /**
   * Validates if the current signal values represent a valid geographic coordinate.
   * Uses a utility helper for the logic.
   */
  public get isManualAddValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.manualLat(), this.manualLon());
  }
}
