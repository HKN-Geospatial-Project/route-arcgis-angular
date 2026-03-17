/**
 * Represents a basic geographic location.
 * This model is used for general purpose coordinate handling within the application.
 */
export interface Coordinates {
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
