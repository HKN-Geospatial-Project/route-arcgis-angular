import { RoutePointType } from '../../../models/enums/route-point-type.enum';

export interface RoutePointVO {
  /**
   * The latitude in decimal degrees.
   */
  latitude: number;
  /**
   * The longitude in decimal degrees.
   */
  longitude: number;
  /**
   * The elevation or height of the point in meters.
   */
  altitude: number | null;

  type: RoutePointType;
}
