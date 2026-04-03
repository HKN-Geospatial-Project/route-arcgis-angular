// Angular Core Imports
import { Component, OnDestroy, inject, signal, effect, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Application Core Imports
import { ClickedPointEvent } from '../../map-library/models/event/clicked-point.event';
import { CoordinateUtils } from '../../utils/coordinate.utils';
import { DataMapConversionUtils } from '../../utils/data-map-conversion.utils';
import { MapEventProviderService } from '../../map-library/abstract/services/map-event-provider.service';
import { RouteDataService } from '../../services/route-data-service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import {
  RoutePointListComponent,
  RoutePointListItem,
} from '../../components/route-point-list/route-point-list.component';
import { RoutePointListUtils } from '../../components/route-point-list/route-point-list.utils';
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
export class CreateRoutePageComponent implements OnDestroy {
  // --- Dependencies ---

  /** Service for programmatic page navigation. */
  private router = inject(Router);

  /** Service used to display success or error notification toasts. */
  private toastService = inject(ToastrService);

  /** Service that broadcasts clicks from the ArcGIS Map component. */
  private mapEventProviderService = inject(MapEventProviderService);

  /** Service responsible for persisting route data to the backend. */
  private routeDataService = inject(RouteDataService);

  /** Service responsible for drawing graphics on the map. */
  private routeService = inject(RouteGraphicsService);

  // --- State Variables ---

  /** The user-defined name for the route being created. */
  public routeName = signal<string>('');

  /** Reactive Signal for the latitude input field. */
  public manualLat = signal<number | null>(null);

  /** Reactive Signal for the longitude input field. */
  public manualLon = signal<number | null>(null);

  /** Reactive Signal holding the list of formatted points to be displayed in the UI. */
  public routePointList = signal<RoutePointListItem[]>([]);

  /**
   * Initializes the component and sets up the reactive rendering effect.
   */
  constructor() {
    /**
     * THE REACTIVE ENGINE:
     * This effect automatically watches the `routePointList` signal.
     * Whenever a point is added, moved, or deleted from anywhere in the app,
     * this effect fires, transforms the data to satisfy strict interfaces,
     * and forces the map to redraw instantly.
     */
    effect(() => {
      const currentPoints = this.routePointList(); // Read the signal

      if (currentPoints.length === 0) {
        this.routeService.clearAll();
      } else {
        const mappedPoints =
          DataMapConversionUtils.convertListRoutePointListItemToRoutePointVO(currentPoints);

        this.routeService.renderRoute(mappedPoints);
      }
    });

    /** When the user clicks the map, the coordinates automatically populate the manual input signals. */
    this.mapEventProviderService.mapClicked$
      .pipe(takeUntilDestroyed())
      .subscribe((clickedCoordinate: ClickedPointEvent) => {
        this.manualLat.set(clickedCoordinate.latitude);
        this.manualLon.set(clickedCoordinate.longitude);
      });
  }

  /** Lifecycle hook: Custom cleanup */
  ngOnDestroy(): void {
    this.routeService.clearAll();
  }

  // --- Core Actions ---

  /** Pushes the coordinates currently in the manual input fields into the route list. */
  public addManualPoint(): void {
    const newPoint = RoutePointListUtils.createRoutePointListItem(
      this.manualLat(),
      this.manualLon(),
    );
    this.routePointList.update((current) => [...current, newPoint]);
  }

  /** Finalizes the route creation process. */
  public saveRoute(): void {
    const dtoList = this.routePointList().map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    }));

    this.routeDataService.create(this.routeName(), dtoList).subscribe({
      next: (response) => {
        console.log(response);
        this.toastService.success('Success! Database saved it');
      },
      error: (err) => {
        console.log(err);
        this.toastService.error('Uh oh, something went wrong');
      },
    });
  }

  /** Wipes the route list, which triggers the map to clear itself. */
  public resetRoute(): void {
    this.routePointList.set([]);
  }

  /** Navigates back to the main page. */
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }

  // --- Sub-component Event Handlers ---

  /** Updates a specific point in the route list when edited in the UI list. */
  public onListPointUpdated(event: { index: number; updatedPoint: RoutePointListItem }) {
    // Reassigning the array triggers the Map to redraw automatically!
    this.routePointList.update((current) => {
      const newArray = [...current];
      newArray[event.index] = event.updatedPoint;
      return newArray;
    });
  }

  /** Removes a point from the route list when deleted from the UI list. */
  public onListPointDeleted(index: number): void {
    this.routePointList.update((current) => current.filter((_, i) => i !== index));
  }

  /** Reorders a point in the route list when moved in the UI list. */
  public onListPointMoved(event: { oldIndex: number; newIndex: number }): void {
    this.routePointList.update((current) => {
      const newArray = [...current];
      const [movedItem] = newArray.splice(event.oldIndex, 1);
      newArray.splice(event.newIndex, 0, movedItem);
      return newArray;
    });
  }

  // --- Computed Validation Properties ---

  /** Checks if the current manual coordinates are mathematically valid. */
  public isManualAddValid = computed(() => {
    const lat = this.manualLat();
    const lon = this.manualLon();
    if (lat === null || lon === null) return false;
    return CoordinateUtils.isValidGeographicCoordinate(lat, lon);
  });

  /** Validates the currently typed route name against formatting and length rules. */
  public nameError = computed(() => {
    const name = this.routeName().trim();

    // If the field is empty, we don't show a specific typing error yet
    if (name.length === 0) return null;

    // Rule 1: Must start with a letter.
    // The '!' reverses the logic: if it does NOT match a starting letter, return error.
    if (!/^[a-zA-Z]/.test(name)) return 'The route name must start with a letter.';

    // Rule 2: Allowed characters.
    // This regex looks for anything that is NOT (^) a letter, number, space, or hyphen.
    if (/[^a-zA-Z0-9 -]/.test(name))
      return 'Only letters, numbers, spaces, and hyphens are allowed.';

    // Rule 3: Length limits.
    if (name.length < 3 || name.length > 50)
      return 'The name must be between 3 and 50 characters long.';

    // If it passes all rules, return null (no errors)
    return null;
  });

  /**
   * Evaluates if the entire route is valid and ready to be saved to the database.
   * Requires at least two points (to form a line) and a valid route name.
   */
  public canSave = computed(() => {
    return (
      this.routePointList().length >= 2 &&
      this.routeName().trim().length > 0 &&
      this.nameError() === null
    );
  });

  /**
   * Evaluates if there is any active route data that can be reset.
   */
  public canReset = computed(() => {
    return this.routePointList().length > 0;
  });
}
