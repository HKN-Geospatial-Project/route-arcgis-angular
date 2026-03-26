import { RoutePointDto } from './route-point.dto';

export type RouteResponseDTO = {
  id: number;
  name: string;
  points: RoutePointDto[];
};
