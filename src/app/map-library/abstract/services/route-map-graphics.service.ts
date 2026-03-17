import { Coordinates } from '../../models/coordinates.model';

/**
 * Abstract service responsible for managing and rendering
 * Route graphical elements on the map surface.
 */
export abstract class RouteGraphicsService {
  /**
   * Links the abstract graphics service to the concrete map view instance.
   * This must be called immediately after the map is initialized so the service
   * has a canvas to draw on.
   * * @param viewReference - The underlying map view instance (e.g., ArcGIS MapView).
   * Typed as `any` to keep this abstraction completely
   * decoupled from specific third-party mapping libraries.
   */
  abstract registerView(viewReference: any): void;

  /**
   * Draws a geographical point (marker) on the map and automatically updates
   * any connecting lines to include this new coordinate.
   * * @param coordinates - The latitude, longitude, and optional altitude of the point to add.
   */
  abstract addPoint(coordinates: Coordinates): void;

  /**
   * Removes all drawn graphics (points and lines) from the route layer,
   * resetting the map's drawings to a completely blank state.
   */
  abstract clearAll(): void;
}
