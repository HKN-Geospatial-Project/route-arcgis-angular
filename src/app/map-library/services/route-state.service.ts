import { Injectable, signal } from '@angular/core';
import { RoutePointListItem } from '../../components/route-point-list/route-point-list.component';

/**
 * The Single Source of Truth for the route currently being built.
 * This service centralizes the state using Angular Signals, ensuring that the
 * UI and the Map Graphics are always perfectly synchronized.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  /**
   * Private internal signal storing the array of route points.
   * Keeping it private prevents external components from mutating the array directly,
   * enforcing a unidirectional data flow.
   */
  private readonly _points = signal<RoutePointListItem[]>([]);

  /**
   * Publicly exposed, read-only version of the signal.
   * Components and effects can bind to this to react to state changes.
   */
  public readonly points = this._points.asReadonly();

  /** Appends a new coordinate point to the end of the route array. */
  public addPoint(point: RoutePointListItem): void {
    // .update() provides the current array so we can return a new one safely
    this._points.update((current) => [...current, point]);
  }

  /** Updates an existing point's data at a specific index. */
  public updatePoint(index: number, updatedPoint: RoutePointListItem): void {
    this._points.update((current) => {
      const newArray = [...current];
      newArray[index] = updatedPoint;
      return newArray;
    });
  }

  /** Removes a point from the route based on its index. */
  public removePoint(index: number): void {
    this._points.update((current) => current.filter((_, i) => i !== index));
  }

  /** Changes the order of points within the route. */
  public movePoint(oldIndex: number, newIndex: number): void {
    this._points.update((current) => {
      const newArray = [...current];
      const [movedItem] = newArray.splice(oldIndex, 1);
      newArray.splice(newIndex, 0, movedItem);
      return newArray;
    });
  }

  /** Wipes the entire state, resetting the route to an empty array. */
  public clearRoute(): void {
    this._points.set([]);
  }
}
