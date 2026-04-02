import { RoutePointListItem } from '../components/route-point-list/route-point-list.component';
import { RoutePointVO } from '../map-library/models/value-objects/route-point.vo';
import { RoutePointType } from '../models/enums/route-point-type.enum';

export class DataMapConversionUtils {
  public static convertToRoutePointVO(
    latitude: number | null | undefined,
    longitude: number | null | undefined,
    altitude: number | null = null,
    type: RoutePointType = RoutePointType.NOT_DEFINED,
  ) {
    if (latitude == null || longitude == null) {
      throw new Error(`Critical Error: RoutePointVO is missing coordinates.`);
    }
    return {
      latitude: latitude,
      longitude: longitude,
      altitude: altitude,
      type: type,
    };
  }

  public static convertPointVOToRoutePointListItem(point: RoutePointVO): RoutePointListItem {
    if (point.latitude == null || point.longitude == null) {
      throw new Error(`Critical Error: RoutePointVO is missing coordinates.`);
    }

    return {
      latitude: point.latitude as number,
      longitude: point.longitude as number,
    };
  }

  public static convertRoutePointListItemToRoutePointVO(point: RoutePointListItem): RoutePointVO {
    return {
      latitude: point.latitude,
      longitude: point.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    };
  }

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
