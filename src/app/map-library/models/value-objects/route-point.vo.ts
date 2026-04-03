import { RoutePointType } from '../../../models/enums/route-point-type.enum';

/**
 * Value Object representing a geographic point in the application's domain.
 * It is immutable (readonly) to ensure state predictability across the app.
 */
export interface RoutePointVO {
  /**
   * The latitude in decimal degrees.
   */
  readonly latitude: number;
  /**
   * The longitude in decimal degrees.
   */
  readonly longitude: number;
  /**
   * The elevation or height of the point in meters.
   * Null if not provided/applicable.
   */
  readonly altitude: number | null;
  /**
   * Type of this route point.
   */
  readonly type: RoutePointType;
}
