// Angular Core Imports
import { Component, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// Application Core Imports
import { ClickedPointVO } from '../../map-library/models/value-objects/clicked-point.vo';
import { CoordinateUtils } from '../../utils/coordinate.utils';
import { DataMapConversionUtils } from '../../utils/data-map-conversion.utils';
import { DTORouteConversionUtils } from '../../utils/dto-route-conversion.utils';
import { MapEventProviderService } from '../../map-library/abstract/services/map-event-provider.service';
import { RouteDataService } from '../../services/route-data-service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import {
  RoutePointListComponent,
  RoutePointListItem,
} from '../../components/route-point-list/route-point-list.component';
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
  // --- Dependencies ---

  /** Subscription to the global map click event stream. Must be cleaned up on destroy. */
  private clickSubscription!: Subscription;

  /** Service for programmatic page navigation. */
  private router = inject(Router);

  /** Service used to display success or error notification toasts. */
  private toastService = inject(ToastrService);

  /** Service that broadcasts clicks from the ArcGIS Map component. */
  private mapEventProviderService = inject(MapEventProviderService);

  /** Service responsible for persisting route data to the backend. */
  private routeDataService = inject(RouteDataService);

  /** Centralized state manager for the route points. */
  private routeState = inject(RouteStateService);

  public routePointList = signal<RoutePointListItem[]>([]);

  // --- State Variables ---

  /** The user-defined name for the route being created. */
  public routeName: string = '';

  /** Reactive Signal for the latitude input field. */
  public manualLat = signal<number | null>(null);

  /** Reactive Signal for the longitude input field. */
  public manualLon = signal<number | null>(null);

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
        this.routePointList.set([]);
      } else {
        const mappedPoints =
          DataMapConversionUtils.convertListRoutePointVOToRoutePointListItem(currentPoints);

        this.routePointList.set(mappedPoints);

        this.routeService.renderRoute(currentPoints);
      }
    });
  }

  /** Lifecycle hook: Initializes map listeners when the component mounts. */
  ngOnInit(): void {
    /** When the user clicks the map, the coordinates automatically populate the manual input signals. */
    this.clickSubscription = this.mapEventProviderService.mapClicked$.subscribe(
      (clickedCoordinate: ClickedPointVO) => {
        this.manualLat.set(clickedCoordinate.latitude);
        this.manualLon.set(clickedCoordinate.longitude);
      },
    );
  }

  /** Lifecycle hook: Cleans up RxJS subscriptions to prevent memory leaks. */
  ngOnDestroy(): void {
    if (this.clickSubscription) {
      this.clickSubscription.unsubscribe();
    }
  }

  /** Pushes the coordinates currently in the manual input fields into the global RouteState. */
  public addManualPoint(): void {
    this.routeState.addPoint(
      DataMapConversionUtils.convertToRoutePointVO(this.manualLat(), this.manualLon()),
    );
  }

  /** Finalizes the route creation process. */
  public saveRoute(): void {
    const points = DTORouteConversionUtils.convertListRoutePointVOToRoutePointDTO(
      this.routeState.points(),
    );

    this.routeDataService.create(this.routeName, points).subscribe({
      next: (response) => this.toastService.success('Success! Database saved it'),
      error: (err) => this.toastService.error('Uh oh, something went wrong'),
    });
  }

  /** Wipes the global route state, which triggers the map to clear itself. */
  public resetRoute(): void {
    this.routeState.clearRoute();
  }

  /** Navigates back to the main page. */
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }

  // --- Sub-component Event Handlers ---

  /** Updates a specific point in the global state when edited in the UI list. */
  public onListPointUpdated(event: { index: number; updatedPoint: RoutePointListItem }) {
    const tmpPoint = DataMapConversionUtils.convertRoutePointListItemToRoutePointVO(
      event.updatedPoint,
    );

    this.routeState.updatePoint(event.index, tmpPoint);
  }

  /** Removes a point from the global state when deleted from the UI list. */
  public onListPointDeleted(index: number): void {
    this.routeState.removePoint(index);
  }

  /** Reorders a point in the global state when moved in the UI list. */
  public onListPointMoved(event: { oldIndex: number; newIndex: number }): void {
    this.routeState.movePoint(event.oldIndex, event.newIndex);
  }

  // --- Computed Validation Properties ---

  /** Checks if the current manual coordinates are mathematically valid. */
  public get isManualAddValid(): boolean {
    if (this.manualLat() === null || this.manualLon() === null) {
      return false;
    }
    return CoordinateUtils.isValidGeographicCoordinate(
      this.manualLat() as number,
      this.manualLon() as number,
    );
  }

  /**
   * Evaluates if the entire route is valid and ready to be saved to the database.
   * Requires at least two points (to form a line) and a valid route name.
   * @returns True if the route can be saved, false otherwise.
   */
  public get canSave(): boolean {
    return (
      this.routeState.points().length >= 2 &&
      this.routeName.trim().length > 0 &&
      this.nameError === null
    );
  }

  /**
   * Evaluates if there is any active route data that can be reset.
   * @returns True if there is at least one point in the state, false otherwise.
   */
  public get canReset(): boolean {
    return this.routeState.points() && this.routeState.points().length > 0;
  }

  /**
   * Validates the currently typed route name against formatting and length rules.
   * @returns An error message string if a rule is violated, or `null` if the name is valid or empty.
   */
  get nameError(): string | null {
    const name = this.routeName.trim();

    // If the field is empty, we don't show a specific typing error yet
    if (name.length === 0) {
      return null;
    }

    // Rule 1: Must start with a letter.
    // The '!' reverses the logic: if it does NOT match a starting letter, return error.
    if (!/^[a-zA-Z]/.test(name)) {
      return 'The route name must start with a letter.';
    }

    // Rule 2: Allowed characters.
    // This regex looks for anything that is NOT (^) a letter, number, space, or hyphen.
    if (/[^a-zA-Z0-9 -]/.test(name)) {
      return 'Only letters, numbers, spaces, and hyphens are allowed.';
    }

    // Rule 3: Length limits.
    if (name.length < 3 || name.length > 50) {
      return 'The name must be between 3 and 50 characters long.';
    }

    // If it passes all rules, return null (no errors)
    return null;
  }
}
