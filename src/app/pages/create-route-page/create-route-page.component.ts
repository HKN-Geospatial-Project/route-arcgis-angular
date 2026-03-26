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
import { MapEventProviderService } from '../../map-library/abstract/services/map-event-provider.service';
import { RouteDataService } from '../../services/route-data-service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import { RoutePointListComponent } from '../../components/route-point-list/route-point-list.component';
import { RouteStateService } from '../../map-library/services/route-state.service';
import { RoutePointDto as PointDto, RoutePointDto } from '../../models/dtos/route-point.dto';
import { RoutePointType } from '../../models/enums/route-point-type.enum';

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

  private toastService = inject(ToastrService);

  /** Service that broadcasts clicks from the ArcGIS Map component. */
  private mapEventProviderService = inject(MapEventProviderService);

  private routeDataService = inject(RouteDataService);

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
      (clickedCoordinate: ClickedPointVO) => {
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
    const points: RoutePointDto[] = this.routeState.points().map((item) => ({
      latitude: item.latitude ?? 0.0,
      longitude: item.longitude ?? 0.0,
      altitude: 0.0,
      type: RoutePointType.NOT_DEFINED,
    }));

    this.routeDataService.save(this.routeName, points).subscribe({
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

  /** Validates if the current signal values represent a valid geographic coordinate. */
  public get isManualAddValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.manualLat(), this.manualLon());
  }

  public get canSave(): boolean {
    return (
      this.routeState.points().length >= 2 &&
      this.routeName.trim().length > 0 &&
      this.nameError === null
    );
  }

  public get canReset(): boolean {
    return this.routeState.points() && this.routeState.points().length > 0;
  }

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
