import { RoutePointType } from '../enums/route-point-type.enum';

export type RoutePointDto = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  type: RoutePointType;
};
