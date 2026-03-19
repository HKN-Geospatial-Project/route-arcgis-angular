// Angular Core Imports
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

// Application Imports
import { ClickedCoordinate } from '../../models/clicked-coordinate.model';
import { MapEventProviderService } from '../../abstract/services/map-event-provider.service';

/**
 * Concrete implementation of MapEventProviderService using RxJS Subjects.
 * This service manages the internal lifecycle of map-related events specifically
 * for the ArcGIS engine.
 */
@Injectable()
export class ArcGISMapEventProviderService implements MapEventProviderService {
  /** Internal Subject that acts as the source of truth for map clicks. */
  private mapClickSource = new Subject<ClickedCoordinate>();

  /**
   * Publicly exposed observable derived from the internal Subject.
   * Components subscribe to this to receive real-time coordinate updates.
   */
  public mapClicked$: Observable<ClickedCoordinate> = this.mapClickSource.asObservable();

  /**
   * Pushes a new coordinate payload into the event stream.
   * @param coordinates - The geographic and screen data captured from the ArcGIS MapView.
   */
  public emitMapClick(coordinates: ClickedCoordinate): void {
    this.mapClickSource.next(coordinates);
  }
}
