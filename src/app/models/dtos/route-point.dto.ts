import { RoutePointType } from '../enums/route-point-type.enum';

export interface RoutePointDto {
  latitude: number;
  longitude: number;
  altitude: number;
  type: RoutePointType;
}
