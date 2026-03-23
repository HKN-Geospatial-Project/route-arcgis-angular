import { RoutePointDto } from './route-point.dto';

export interface RouteRequest {
  name: string;
  points: RoutePointDto[];
}
