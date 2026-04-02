import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoordinateUtils } from '../../utils/coordinate.utils';

/**
 * Interface representing a single point in the route list.
 */
export interface RoutePointListItem {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}

/**
 * Component responsible for displaying, editing, reordering, and deleting a list of route points.
 */
@Component({
  selector: 'component-route-point-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-point-list.component.html',
  styleUrls: ['./route-point-list.component.css'],
})
export class RoutePointListComponent {
  /** The list of route points passed from the parent component to be displayed. */
  @Input() pointList: RoutePointListItem[] = [];

  /** Emits an event when a point is edited and saved. */
  @Output() pointUpdated = new EventEmitter<{ index: number; updatedPoint: RoutePointListItem }>();

  /** Emits the index of the point that needs to be deleted. */
  @Output() pointDeleted = new EventEmitter<number>();

  /** Emits the old and new index when a point is moved up or down in the list. */
  @Output() pointMoved = new EventEmitter<{ oldIndex: number; newIndex: number }>();

  // --- Local UI State ---

  /** Tracks the index of the point currently being edited. Null if no point is in edit mode. */
  public editingIndex: number | null = null;

  /** Tracks the index of the point whose management toolbar is currently expanded. */
  public expandedIndex: number | null = null;

  /** Temporary storage for latitude input while a user is editing a point. */
  public editLatitude: number | null = null;

  /** Temporary storage for longitude input while a user is editing a point. */
  public editLongitude: number | null = null;

  // --- UI Toggle Methods ---

  /**
   * Toggles the visibility of the management toolbar (edit/move/delete options) for a specific point.
   * @param index - The original array index of the point to expand or collapse.
   */
  public toggleExpand(index: number): void {
    if (this.expandedIndex === index) {
      // If clicking the one that is already open, close it and cancel any edits
      this.expandedIndex = null;
      this.editingIndex = null;
    } else {
      // If opening a new one, open it and cancel edits on the previous one
      this.expandedIndex = index;
      this.editingIndex = null;
    }
  }

  // --- Edit Logic ---

  /**
   * Enters edit mode for a specific point, pre-filling the temporary inputs with current values.
   * @param index - The original array index of the point to edit.
   */
  public startEdit(index: number): void {
    this.editingIndex = index;
    // Pre-fill the input fields with the current point's data
    this.editLatitude = this.pointList[index].latitude ?? null;
    this.editLongitude = this.pointList[index].longitude ?? null;
  }

  /**
   * Exits edit mode without saving changes.
   */
  public cancelEdit(): void {
    // Just closing the edit mode is enough. The temp variables will be
    // overwritten the next time startEdit() is called.
    this.editingIndex = null;
  }

  /**
   * Constructs the modified point from temporary variables and emits the update event.
   * @param index - The original array index of the point being saved.
   */
  public saveEdit(index: number): void {
    // Construct the new point, maintaining any other properties it might have had
    const modifiedPoint: RoutePointListItem = {
      ...this.pointList[index],
      latitude: this.editLatitude,
      longitude: this.editLongitude,
    };
    // Broadcast the change to the Parent Component
    this.pointUpdated.emit({ index, updatedPoint: modifiedPoint });
    // Close edit mode
    this.cancelEdit();
  }

  // --- Delete Logic ---

  /**
   * Emits a deletion event for a specific point and closes the expanded toolbar.
   * @param index - The original array index of the point to delete.
   */
  public deletePoint(index: number): void {
    // Broadcast the change to the Parent Component
    this.pointDeleted.emit(index);
    // Close the toolbar so the user doesn't see a glitch as the array shifts
    this.expandedIndex = null;
  }

  // --- Move Logic ---

  /**
   * Moves a point visually "UP" the list (towards the end of the data array).
   * @param index - The current index of the point.
   */
  public movePointUp(index: number): void {
    // Visually UP means moving towards the END of the actual array
    if (index < this.pointList.length - 1) {
      // Broadcast the change to the Parent Component
      this.pointMoved.emit({ oldIndex: index, newIndex: index + 1 });
      // Keep the toolbar open and visually following the item that just moved up
      this.expandedIndex = index + 1;
    }
  }

  /**
   * Moves a point visually "DOWN" the list (towards the start of the data array).
   * @param index - The current index of the point.
   */
  public movePointDown(index: number): void {
    // Visually DOWN means moving towards the START of the actual array
    if (index > 0) {
      // Broadcast the change to the Parent Component
      this.pointMoved.emit({ oldIndex: index, newIndex: index - 1 });
      // Keep the toolbar open and visually following the item that just moved down
      this.expandedIndex = index - 1;
    }
  }

  // --- Computed Properties (Getters) ---

  /**
   * Returns a reversed copy of the point list for display purposes (newest on top),
   * while mapping each item to its original index in the source array.
   */
  public get reversedPoints() {
    return this.pointList.map((point, index) => ({ point: point, originalIndex: index })).reverse();
  }

  /**
   * Validates whether the currently typed coordinates in edit mode are geographically valid.
   */
  public get isEditValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.editLatitude, this.editLongitude);
  }
}
