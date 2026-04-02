import { RoutePointVO } from '../map-library/models/value-objects/route-point.vo';
import { RoutePointDto } from '../models/dtos/route-point.dto';
import { RoutePointType } from '../models/enums/route-point-type.enum';

export class DTORouteConversionUtils {
  public static convertListRoutePointVOToRoutePointDTO(list: RoutePointVO[]): RoutePointDto[] {
    return list.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    }));
  }

  public static convertListRoutePointDTOToRoutePointVO(list: RoutePointDto[]): RoutePointVO[] {
    return list.map((item) => ({
      latitude: item.latitude,
      longitude: item.longitude,
      altitude: null,
      type: RoutePointType.NOT_DEFINED,
    }));
  }
}
