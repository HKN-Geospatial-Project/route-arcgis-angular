import { RoutePointDto } from './route-point.dto';

/**
 * Data Transfer Object representing a fully persisted route.
 * Represents the payload received from the server.
 */
export type RouteResponseDTO = {
  /** The unique database identifier for the route. */
  readonly id: number;
  /** The user-defined name of the route. */
  readonly name: string;
  /** The sequential list of points that make up the route. */
  readonly points: readonly RoutePointDto[];
};
