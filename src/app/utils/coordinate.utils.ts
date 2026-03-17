/**
 * A stateless utility class containing helper methods for geographic data manipulation.
 * All methods are static to allow easy access across the application without
 * the need for instantiation.
 */
export class CoordinateUtils {
  /**
   * Validates if the provided numbers represent a physically possible geographic location.
   * * Validation Rules:
   * 1. Values must not be null or undefined.
   * 2. Latitude must be within the range of [-90, 90] degrees.
   * 3. Longitude must be within the range of [-180, 180] degrees.
   * @param lat - The latitude value to validate.
   * @param lon - The longitude value to validate.
   * @returns `true` if both values are valid numbers within geographic boundaries; otherwise `false`.
   */
  public static isValidGeographicCoordinate(
    lat: number | null | undefined,
    lon: number | null | undefined,
  ): boolean {
    // 1. Check if they are empty or not provided
    if (lat === null || lat === undefined) return false;
    if (lon === null || lon === undefined) return false;

    // 2. Check geographic ranges for the Earth's coordinate system
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;

    // The input is a valid coordinate
    return true;
  }
}
