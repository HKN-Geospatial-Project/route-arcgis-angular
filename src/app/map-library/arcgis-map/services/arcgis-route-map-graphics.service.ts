// Angular Core Imports
import { Injectable } from '@angular/core';

// ArcGIS Core Imports
import MapView from '@arcgis/core/views/MapView';
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';

// Application Imports
import { PointVO } from '../../models/value-objects/point.vo';
import { RouteGraphicsService } from '../../abstract/services/route-map-graphics.service';

/**
 * Concrete implementation of RouteGraphicsService for ArcGIS.
 * Following the stateless architecture, this service acts purely as a renderer.
 * It does not maintain state; instead, it redraws the graphics layer whenever
 * it receives a new array of coordinates from the RouteStateService.
 */
@Injectable()
export class ArcGISRouteGraphicsService implements RouteGraphicsService {
  /** Local reference to the active ArcGIS MapView. */
  private view: MapView | null = null;

  /**
   * The dedicated ArcGIS GraphicsLayer.
   * Acts as an overlay container for all route-related visuals.
   */
  private routeLayer = new GraphicsLayer();

  /**
   * Injects the RouteLayer into the MapView's map instance.
   * @param viewReference - The active ArcGIS MapView provided by the map component.
   */
  public registerView(viewReference: MapView): void {
    this.view = viewReference;
    // Uses optional chaining to safely add the layer once the map is ready.
    this.view?.map?.add(this.routeLayer);
  }

  /**
   * Redraws the entire route based on the provided array of coordinates.
   * Wipes the existing canvas and reconstructs the markers and connecting lines
   * to ensure perfect synchronization with the global state.
   * @param points - The complete array of coordinates representing the current route.
   */
  public renderRoute(points: PointVO[]): void {
    if (!this.view) return;

    // 1. Wipe the canvas clean
    this.routeLayer.removeAll();

    const paths: number[][] = [];

    // 2. Iterate through the single source of truth
    points.forEach((pt) => {
      if (pt.longitude != null && pt.latitude != null) {
        paths.push([pt.longitude, pt.latitude]);

        const pointGraphic = new Graphic({
          geometry: new Point({ longitude: pt.longitude, latitude: pt.latitude }),
          symbol: new SimpleMarkerSymbol({
            color: [0, 121, 193],
            outline: { color: [255, 255, 255], width: 2 },
          }),
        });

        this.routeLayer.graphics.add(pointGraphic, 1);
      }
    });

    // 3. Draw the connecting line if we have at least 2 points
    if (paths.length >= 2) {
      const lineGraphic = new Graphic({
        geometry: new Polyline({ paths: [paths] }),
        symbol: new SimpleLineSymbol({ color: [0, 121, 193], width: 3 }),
      });

      this.routeLayer.graphics.add(lineGraphic, 0);
    }
  }

  /** Instantly wipes all graphics (points and lines) from the layer. */
  public clearAll(): void {
    this.routeLayer.removeAll();
  }
}
