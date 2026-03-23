import { PointVO } from '../../models/value-objects/point.vo';

/**
 * Abstract service responsible for managing and rendering Route graphical
 * elements on the map surface.
 * * DESIGN PATTERN: This service is designed to be stateless. It acts as a
 * "pure renderer" that receives a full state of coordinates and updates
 * the map display to match.
 */
export abstract class RouteGraphicsService {
  /**
   * Links the abstract graphics service to the concrete map view instance.
   * This must be called immediately after the map is initialized so the service
   * has a canvas to draw on.
   * @param viewReference - The underlying map view instance (e.g., ArcGIS MapView).
   * Typed as `any` to keep this abstraction decoupled from specific 3rd-party libraries.
   */
  abstract registerView(viewReference: any): void;

  /**
   * Redraws the entire route based on a provided array of coordinates.
   * @param points - The complete, ordered collection of points to be rendered.
   */
  abstract renderRoute(points: PointVO[]): void;

  /**
   * Removes all drawn graphics from the route layer,
   * resetting the map's drawings to a completely blank state.
   */
  abstract clearAll(): void;
}
