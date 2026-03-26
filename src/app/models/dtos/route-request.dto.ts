import { RoutePointDto } from './route-point.dto';

export type RouteRequestDTO = {
  name: string;
  points: RoutePointDto[];
};
