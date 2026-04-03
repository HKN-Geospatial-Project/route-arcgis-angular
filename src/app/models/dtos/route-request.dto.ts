import { RoutePointDto } from './route-point.dto';

/**
 * Data Transfer Object for creating or updating a route.
 * Represents the payload sent from the client to the server.
 */
export type RouteRequestDTO = {
  /** The user-defined name for the route. */
  readonly name: string;
  /** The sequential list of points that make up the route. */
  readonly points: readonly RoutePointDto[];
};
