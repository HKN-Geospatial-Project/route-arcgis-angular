import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CoordinateListItem {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  elevation: number | undefined;
}

@Component({
  selector: 'component-coordinate-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coordinate-list.component.html',
  styleUrl: './coordinate-list.component.css',
})
export class CoordinateListComponent {
  @Input() coordinateList: CoordinateListItem[] = [];
}
