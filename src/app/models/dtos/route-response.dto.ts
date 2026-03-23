import { RoutePointDto } from './route-point.dto';

export interface RouteResponse {
  id: number;
  name: string;
  points: RoutePointDto[];
}
