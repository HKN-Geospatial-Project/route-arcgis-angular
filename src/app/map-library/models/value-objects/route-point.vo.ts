import { RoutePointType } from '../../../models/enums/route-point-type.enum';
import { PointVO } from './point.vo';

export interface RoutePointVO extends PointVO {
  type: RoutePointType;
}
