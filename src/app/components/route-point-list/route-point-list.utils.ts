/**
 * Utility class for handling data from the RoutePointListItem component.
 */
export class RoutePointListUtils {
  /**
   * Constructs a domain RoutePointListItem from raw numerical inputs, enforcing strict null checks.
   * @throws {Error} If either latitude or longitude is null or undefined.
   */
  public static createRoutePointListItem(
    latitude: number | null | undefined,
    longitude: number | null | undefined,
  ) {
    if (latitude == null || longitude == null) {
      throw new Error(
        `Critical Error: Failed to create RoutePointListItem. Coordinates cannot be null or undefined. Received latitude: ${latitude}, longitude: ${longitude}.`,
      );
    }
    return {
      latitude: latitude,
      longitude: longitude,
    };
  }
}
