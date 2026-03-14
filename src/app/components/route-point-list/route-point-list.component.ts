import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CoordinateUtils } from '../../utils/coordinate.utils';

export interface RoutePointListItem {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
}

@Component({
  selector: 'component-route-point-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './route-point-list.component.html',
  styleUrls: ['./route-point-list.component.css'],
})
export class RoutePointListComponent {
  // --- Inputs & Outputs ---
  @Input() pointList: RoutePointListItem[] = [];

  @Output() pointUpdated = new EventEmitter<{ index: number; updatedPoint: RoutePointListItem }>();
  @Output() pointDeleted = new EventEmitter<number>();
  @Output() pointMoved = new EventEmitter<{ oldIndex: number; newIndex: number }>();

  // --- Local UI State ---
  public editingIndex: number | null = null;
  public expandedIndex: number | null = null;

  // Temporary variables to hold the user's typed numbers before saving
  public editLatitude: number | null = null;
  public editLongitude: number | null = null;

  // --- UI Toggle Methods ---

  // Opens or closes the management button area
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
  public startEdit(index: number): void {
    this.editingIndex = index;
    // Pre-fill the input fields with the current point's data
    this.editLatitude = this.pointList[index].latitude ?? null;
    this.editLongitude = this.pointList[index].longitude ?? null;
  }

  public cancelEdit(): void {
    // Just closing the edit mode is enough. The temp variables will be
    // overwritten the next time startEdit() is called.
    this.editingIndex = null;
  }

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
  public deletePoint(index: number): void {
    this.pointDeleted.emit(index);
    // Close the toolbar so the user doesn't see a glitch as the array shifts
    this.expandedIndex = null;
  }

  // --- Move Logic ---
  public movePointUp(index: number): void {
    // Visually UP means moving towards the END of the actual array
    if (index < this.pointList.length - 1) {
      this.pointMoved.emit({ oldIndex: index, newIndex: index + 1 });
      // Keep the toolbar open and visually following the item that just moved up
      this.expandedIndex = index + 1;
    }
  }

  public movePointDown(index: number): void {
    // Visually DOWN means moving towards the START of the actual array
    if (index > 0) {
      this.pointMoved.emit({ oldIndex: index, newIndex: index - 1 });
      // Keep the toolbar open and visually following the item that just moved down
      this.expandedIndex = index - 1;
    }
  }

  // This getter returns a reversed copy of the array, but remembers the real index!
  public get reversedPoints() {
    return this.pointList.map((point, index) => ({ point: point, originalIndex: index })).reverse();
  }

  // This getter dynamically checks if the current inputs are valid geographic coordinates
  public get isEditValid(): boolean {
    return CoordinateUtils.isValidGeographicCoordinate(this.editLatitude, this.editLongitude);
  }
}
