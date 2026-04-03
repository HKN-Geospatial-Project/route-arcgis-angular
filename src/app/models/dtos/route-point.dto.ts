import { RoutePointType } from '../enums/route-point-type.enum';

/**
 * Data Transfer Object representing a route point.
 * Used strictly for transferring data between the frontend and the backend API.
 */
export type RoutePointDto = {
  /** The latitude in decimal degrees. */
  readonly latitude: number;
  /** The longitude in decimal degrees. */
  readonly longitude: number;
  /** The elevation or height of the point in meters. */
  readonly altitude: number | null;
  /** Type of this route point. */
  readonly type: RoutePointType;
};
