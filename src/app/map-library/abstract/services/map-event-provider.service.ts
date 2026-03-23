import { ClickedPointVO } from '../../models/value-objects/clicked-point.vo';
import { Observable } from 'rxjs';

/**
 * Abstract service that acts as a central event bus for map interactions.
 * It provides an observable stream for map events, allowing decoupled
 * communication between the map component and other UI pages.
 */
export abstract class MapEventProviderService {
  /**
   * An observable stream that emits the coordinates whenever the map is clicked.
   * Components can subscribe to this stream to react to user interactions on the map.
   */
  abstract mapClicked$: Observable<ClickedPointVO>;

  /**
   * Broadcasts a map click event to all active subscribers.
   * * @param coordinates - The geographical coordinates (and related metadata) of the clicked location.
   */
  abstract emitMapClick(coordinates: ClickedPointVO): void;
}
