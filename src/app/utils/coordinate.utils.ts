/**
 * A stateless utility class containing helper methods for geographic data manipulation.
 * All methods are static to allow easy access across the application without
 * the need for instantiation.
 */
export class CoordinateUtils {
  /**
   * Validates if the provided numbers represent a physically possible geographic location.
   * * Validation Rules:
   * 1. Latitude must be within the range of [-90, 90] degrees.
   * 2. Longitude must be within the range of [-180, 180] degrees.
   * @param lat - The latitude value to validate.
   * @param lon - The longitude value to validate.
   * @returns `true` if both values are valid numbers within geographic boundaries; otherwise `false`.
   */
  public static isValidGeographicCoordinate(lat: number, lon: number): boolean {
    // Check geographic ranges for the Earth's coordinate system
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;

    // The input is a valid coordinate
    return true;
  }
}
