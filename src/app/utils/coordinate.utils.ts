export class CoordinateUtils {
  /**
   * Validates if the provided numbers are valid geographic coordinates.
   * Latitude must be between -90 and 90.
   * Longitude must be between -180 and 180.
   */
  public static isValidGeographicCoordinate(
    lat: number | null | undefined,
    lon: number | null | undefined,
  ): boolean {
    // 1. Check if they are empty
    if (lat === null || lat === undefined) return false;
    if (lon === null || lon === undefined) return false;

    // 2. Check geographic ranges
    if (lat < -90 || lat > 90) return false;
    if (lon < -180 || lon > 180) return false;

    // It is a valid coordinate
    return true;
  }
}
