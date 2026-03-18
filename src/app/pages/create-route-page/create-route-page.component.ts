// Angular Core Imports
import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

// Application Core Imports
import { ClickedCoordinate } from '../../map-library/models/clicked-coordinate.model';
import { CoordinateUtils } from '../../utils/coordinate.utils';
import { MapEventProviderService } from '../../map-library/abstract/services/map-event-provider.service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import { RoutePointListComponent } from '../../components/route-point-list/route-point-list.component';
import { RouteStateService } from '../../map-library/services/route-state.service';

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

  /** Centralized state manager for the route points. */
  public routeState = inject(RouteStateService);

  // --- State Variables ---

  /** The user-defined name for the route being created. */
  public routeName: string = '';

  /** Reactive Signal for the latitude input field. */
  public manualLat = signal<number | null | undefined>(null);

  /** Reactive Signal for the longitude input field. */
  public manualLon = signal<number | null | undefined>(null);

  /**
   * Initializes the component and sets up the reactive rendering effect.
   * @param routeService - Service responsible for drawing graphics on the map.
   */
  constructor(private routeService: RouteGraphicsService) {
    /**
     * THE REACTIVE ENGINE:
     * This effect automatically watches the `routeState.points()` signal.
     * Whenever a point is added, moved, or deleted from anywhere in the app,
     * this effect fires, transforms the data to satisfy strict interfaces,
     * and forces the map to redraw instantly.
     */
    effect(() => {
      const currentPoints = this.routeState.points(); // Read the signal

      if (currentPoints.length === 0) {
        this.routeService.clearAll();
      } else {
        // Map the array to explicitly define missing properties (like altitude)
        const mappedPoints = currentPoints.map((pt) => ({
          ...pt,
          altitude: undefined,
        }));
        this.routeService.renderRoute(mappedPoints);
      }
    });
  }

  /** Initializes the component by subscribing to map click events. */
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
   * Pushes the current manual input values into the global RouteState.
   * Note: The map rendering is handled automatically by the effect().
   */
  public addManualPoint(): void {
    this.routeState.addPoint({
      latitude: this.manualLat(),
      longitude: this.manualLon(),
    });
  }

  public saveRoute(): void {
    console.log('saveRoute');
  }

  /** Wipes the global route state, which triggers the map to clear itself. */
  public resetRoute(): void {
    this.routeState.clearRoute();
  }

  /** Navigates back to the main page. */
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }

  /** Validates if the current signal values represent a valid geographic coordinate. */
  public get isManualAddValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.manualLat(), this.manualLon());
  }
}
