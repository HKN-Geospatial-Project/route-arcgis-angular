// Angular Core Imports
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Application Core Imports
import { DTORouteConversionUtils } from '../../utils/dto-route-conversion.utils';
import { FileListComponent, FileItem } from '../../components/file-list/file-list.component';
import { RouteDataService } from '../../services/route-data-service';
import { RouteGraphicsService } from '../../map-library/abstract/services/route-map-graphics.service';
import { RoutePointVO } from '../../map-library/models/value-objects/route-point.vo';

/**
 * The primary entry point of the application.
 * This component serves as the default landing page.
 */
@Component({
  selector: 'main-page',
  standalone: true,
  imports: [FileListComponent],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent implements OnInit {
  // --- Dependencies ---

  /** Angular Router service used for programmatic navigation between pages. */
  private router = inject(Router);

  /** Service used to display success or error notification toasts. */
  private toastService = inject(ToastrService);

  /** Service responsible for persisting route data to the backend. */
  private routeDataService = inject(RouteDataService);

  /** Centralized state manager for the route points. */
  public routeGraphicsService = inject(RouteGraphicsService);

  // --- State Variables ---

  /**
   * A reactive signal holding the array of route files.
   * Updating this signal automatically triggers the UI to re-render the file list.
   */
  public routeList = signal<FileItem[]>([]);

  /**
   * A reactive flag indicating if a deletion process is currently in progress.
   * Used to show loading spinners and disable buttons to prevent duplicate actions.
   */
  public isDeleting = signal<boolean>(false);

  /**
   * Lifecycle hook that executes when the component initializes.
   * Fetches all saved routes from the database, maps them to the local `FileItem`
   * interface, and populates the `routeList` signal.
   */
  ngOnInit(): void {
    this.routeDataService.getAll().subscribe({
      next: (response) => {
        const mappedData = response.map((item) => ({
          id: item.id.toString(),
          name: item.name,
          createdAt: new Date(),
        }));

        this.routeList.set(mappedData);
      },
      error: (err) => this.toastService.error('Uh oh, something went wrong'),
    });
  }

  // --- Navigation & Event Handlers ---

  /**
   * Handles the click event for the "Create Route" button.
   */
  public onCreateRouteButtonPressedEvent(): void {
    this.router.navigate(['/create-route-page']);
  }

  /**
   * Handles the event triggered when the user requests to edit a specific file.
   * @param item - The file object targeted for editing.
   */
  public onEditFileEvent(item: FileItem): void {
    this.router.navigate(['/edit-route-page']);
  }

  /**
   * Handles the event triggered when the user confirms the deletion of a file.
   * @param item - The file object confirmed for deletion.
   */
  public onDeleteFileEvent(item: FileItem): void {
    // Updates the `isDeleting` state to trigger loading UI, communicates with the API, and refreshes the local list upon success.
    this.isDeleting.set(true);

    this.routeDataService.delete(item.id).subscribe({
      next: () => {
        this.routeGraphicsService.clearAll();
        // We filter the current list to remove the deleted ID
        const updatedList = this.routeList().filter((f) => f.id !== item.id);
        this.routeList.set(updatedList);
        this.toastService.success(`Route "${item.name}" deleted successfully.`);
        this.isDeleting.set(false);
      },
      error: (err) => {
        this.toastService.error('Could not delete the route. Please try again.');
        this.isDeleting.set(false);
      },
    });
  }

  /**
   * Handles the event triggered when a user expands or collapses a file card in the list.
   * @param item - The selected file object, or null if the user deselected the file.
   */
  public onSelectFileEvent(item: FileItem | null): void {
    if (item) {
      this.routeDataService.getById(item.id).subscribe({
        next: (response) => {
          const mappedPoints: RoutePointVO[] = [];
          response.points.forEach((item) => {
            mappedPoints.push(DTORouteConversionUtils.convertRoutePointVOToRoutePointDTO(item));
          });
          this.routeGraphicsService.renderRoute(mappedPoints);
        },
        error: (err) => {
          this.routeGraphicsService.clearAll();
          this.toastService.error('Uh oh, something went wrong');
        },
      });
    } else {
      this.routeGraphicsService.clearAll();
    }
  }
}
