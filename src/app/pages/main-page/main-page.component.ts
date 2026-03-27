// Angular Core Imports
import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

// Application Core Imports
import { FileListComponent, FileItem } from '../../components/file-list/file-list.component';
import { RouteDataService } from '../../services/route-data-service';

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

  // --- State Variables ---

  /**
   * A reactive signal holding the array of route files.
   * Updating this signal automatically triggers the UI to re-render the file list.
   */
  public routeList = signal<FileItem[]>([]);

  /**
   * Lifecycle hook that executes when the component initializes.
   * Fetches all saved routes from the database, maps them to the local `FileItem`
   * interface, and populates the `routeList` signal.
   */
  ngOnInit(): void {
    this.routeDataService.getAllRoutes().subscribe({
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
    console.log('Navigate to Edit Page: ' + item.id);
  }

  /**
   * Handles the event triggered when the user confirms the deletion of a file.
   * @param item - The file object confirmed for deletion.
   */
  public onDeleteFileEvent(item: FileItem): void {
    console.log('Delete file: ' + item.id);
  }

  /**
   * Handles the event triggered when a user expands or collapses a file card in the list.
   * @param item - The selected file object, or null if the user deselected the file.
   */
  public onSelectFileEvent(item: FileItem | null): void {
    if (item) {
      console.log('Selected file: ' + item.id);
    } else {
      console.log('No file selected');
    }
  }
}
