import { RoutePointListItem } from '../components/route-point-list/route-point-list.component';
import { RoutePointVO } from '../map-library/models/value-objects/route-point.vo';
import { RoutePointType } from '../models/enums/route-point-type.enum';

/**
 * Utility class handling data transformations between domain Value Objects (VOs)
 * and UI-specific structural models (like Route List Items).
 */
export class DataMapConversionUtils {
  /**
   * Constructs a domain RoutePointVO from raw numerical inputs, enforcing strict null checks.
   * @throws {Error} If either latitude or longitude is null or undefined.
   */
  public static convertToRoutePointVO(
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    altitude: number | null = null,
    type: RoutePointType = RoutePointType.NOT_DEFINED,
  ) {
    if (latitude == null || longitude == null) {
      throw new Error(
        `Critical Error: Failed to create RoutePointVO. Coordinates cannot be null or undefined. Received latitude: ${latitude}, longitude: ${longitude}.`,
      );
    }
    return {
      latitude: latitude,
      longitude: longitude,
      altitude: altitude,
      type: type,
    };
  }

  /**
   * Strips a domain VO down to a basic UI list item, guaranteeing valid numbers.
   * @throws {Error} If the domain VO is missing strict coordinate values.
   */
  public static convertPointVOToRoutePointListItem(point: RoutePointVO): RoutePointListItem {
    if (point.latitude == null || point.longitude == null) {
      throw new Error(`Critical Error: RoutePointVO is missing coordinates.`);
    }

    return {
      latitude: point.latitude as number,
      longitude: point.longitude as number,
    };
  }

  /**
   * Promotes a basic UI list item back to a domain VO, applying default fallback properties.
   */
  public static convertRoutePointListItemToRoutePointVO(point: RoutePointListItem): RoutePointVO {
    return {
      latitude: point.latitude,
      longitude: point.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    };
  }

  /**
   * Maps an array of domain VOs to UI list items, validating coordinates for each item.
   * @throws {Error} If any object in the array contains invalid coordinates.
   */
  public static convertListRoutePointVOToRoutePointListItem(
    list: RoutePointVO[],
  ): RoutePointListItem[] {
    const mappedPoints: RoutePointListItem[] = list.map((pt, index) => {
      if (pt.latitude == null || pt.longitude == null) {
        throw new Error(`Critical Error: RoutePointVO at index ${index} is missing coordinates.`);
      }

      return {
        latitude: pt.latitude as number,
        longitude: pt.longitude as number,
      };
    });

    return mappedPoints;
  }

  /**
   * Maps an array of UI list items back to domain VOs with default fallback properties.
   */
  public static convertListRoutePointListItemToRoutePointVO(
    list: RoutePointListItem[],
  ): RoutePointVO[] {
    const mappedPoints: RoutePointVO[] = list.map((pt, index) => ({
      latitude: pt.latitude,
      longitude: pt.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    }));
    return mappedPoints;
  }
}
