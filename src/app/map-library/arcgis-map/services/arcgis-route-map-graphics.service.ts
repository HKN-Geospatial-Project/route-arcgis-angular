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
import { Coordinates } from '../../models/coordinates.model';
import { RouteGraphicsService } from '../../abstract/services/route-map-graphics.service';

/**
 * Concrete implementation of RouteGraphicsService for ArcGIS.
 * Manages a dedicated GraphicsLayer to render Route graphical elements on the map surface.
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
   * Internal collection of raw coordinate pairs [longitude, latitude].
   * Used to reconstruct the polyline path as new points are added.
   */
  private routePoints: number[][] = [];

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
   * Adds a new point to the route.
   * @param coordinates - The point data containing lat/lon/alt.
   */
  public addPoint(coordinates: Coordinates): void {
    if (!this.view) {
      console.warn('Cannot draw: Map View is not registered yet!');
      return;
    }

    if (coordinates.longitude == null || coordinates.latitude == null) {
      console.warn('Cannot draw: Incomplete coordinates provided.');
      return;
    }

    // Stores the coordinate for path calculation.
    this.routePoints.push([coordinates.longitude, coordinates.latitude]);

    // Renders the marker graphic.
    const point = new Point({
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    });

    const markerSymbol = new SimpleMarkerSymbol({
      color: [0, 121, 193],
      outline: { color: [255, 255, 255], width: 2 },
    });

    const pointGraphic = new Graphic({
      geometry: point,
      symbol: markerSymbol,
    });

    this.routeLayer.graphics.add(pointGraphic, 1);

    // Updates the polyline to include the new segment.
    this.drawRouteLine();
  }

  /**
   * Resets the service state and clears all visuals from the GraphicsLayer.
   */
  public clearAll(): void {
    this.routePoints = [];
    this.routeLayer.removeAll();
  }

  /**
   * Internal helper to render the continuous path.
   * It clears existing lines before drawing a new Polyline to ensure visual consistency.
   */
  private drawRouteLine(): void {
    // A line needs at least 2 points to be drawn
    if (this.routePoints.length < 2) return;

    // Filters and removes previous polyline graphics to avoid overlapping paths.
    const oldLines = this.routeLayer.graphics.filter((g) => g.geometry?.type === 'polyline');
    this.routeLayer.removeMany(oldLines.toArray());

    const polyline = new Polyline({
      paths: [this.routePoints],
    });

    const lineSymbol = new SimpleLineSymbol({
      color: [0, 121, 193],
      width: 3,
    });

    const lineGraphic = new Graphic({
      geometry: polyline,
      symbol: lineSymbol,
    });

    this.routeLayer.graphics.add(lineGraphic, 0);
  }
}
