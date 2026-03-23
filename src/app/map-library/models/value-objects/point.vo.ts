/**
 * Represents a basic point.
 * This model is used for general purpose point handling within the application.
 */
export interface PointVO {
  /**
   * The latitude in decimal degrees.
   */
  latitude: number | null | undefined;
  /**
   * The longitude in decimal degrees.
   */
  longitude: number | null | undefined;
  /**
   * The elevation or height of the point in meters.
   */
  altitude: number | null | undefined;
}
