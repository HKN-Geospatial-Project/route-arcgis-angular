import { RoutePointVO } from '../map-library/models/value-objects/route-point.vo';
import { RoutePointDto } from '../models/dtos/route-point.dto';

/**
 * Utility class providing static methods to convert route point objects
 * between Domain Value Objects (VO) and Data Transfer Objects (DTO).
 */
export class DTORouteConversionUtils {
  /** Maps a single domain Value Object to a server-ready Data Transfer Object. */
  public static convertRoutePointVOToRoutePointDTO(item: RoutePointVO): RoutePointDto {
    return {
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      type: item.type,
    };
  }

  /** Maps a single server Data Transfer Object to an internal domain Value Object. */
  public static convertRoutePointDTOtoRoutePointVO(item: RoutePointDto): RoutePointVO {
    return {
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      type: item.type,
    };
  }

  /** Converts an array of domain Value Objects to an array of Data Transfer Objects. */
  public static convertListRoutePointVOToRoutePointDTO(list: RoutePointVO[]): RoutePointDto[] {
    return list.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      type: item.type,
    }));
  }

  /** Converts an array of Data Transfer Objects to an array of domain Value Objects. */
  public static convertListRoutePointDTOToRoutePointVO(list: RoutePointDto[]): RoutePointVO[] {
    return list.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: item.altitude,
      type: item.type,
    }));
  }
}
