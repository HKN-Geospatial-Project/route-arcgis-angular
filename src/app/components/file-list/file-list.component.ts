import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Represents a file entity containing basic metadata.
 */
export interface FileItem {
  /** The unique identifier for the file. */
  id: string;
  /** The display name of the file (e.g., 'Alpha.json'). */
  name: string;
  /** The date and time when the file was created. */
  createdAt: Date;
}

/**
 * Component responsible for displaying and managing a list of files.
 * It provides UI controls for selecting, editing, and deleting files,
 * along with a confirmation modal for destructive actions.
 */
@Component({
  selector: 'component-file-list',
  standalone: true,
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
})
export class FileListComponent {
  /** Angular Router service used for programmatic navigation between pages. */
  private router = inject(Router);

  /**
   * The list of files to be displayed.
   */
  @Input() fileList: FileItem[] = [];

  /**
   * Event emitted when a file is selected (expanded) or deselected (collapsed).
   * Emits the `FileItem` object if a file is selected, or `null` if deselected.
   */
  @Output() fileSelected = new EventEmitter<FileItem | null>();

  /**
   * Event emitted when the user clicks the edit button for a specific file.
   * Emits the `FileItem` that was selected for editing.
   */
  @Output() fileEdited = new EventEmitter<FileItem>();

  /**
   * Event emitted when the user confirms the deletion of a file in the modal.
   * Emits the `FileItem` that should be deleted by the parent component or service.
   */
  @Output() fileDeleted = new EventEmitter<FileItem>();

  /** Flag to control the visibility of the delete confirmation modal. */
  showDeleteModal: boolean = false;

  /** Holds the reference to the file currently pending deletion. */
  fileToDelete: FileItem | null = null;

  /** Stores the ID of the currently expanded file card. Null if no card is expanded. */
  expandedFileId: string | null = null;

  /**
   * Toggles the expansion state of a file card and emits the selection status.
   * If the clicked file is already expanded, it collapses it and emits null.
   *
   * @param id - The unique identifier of the file to toggle.
   */
  toggleExpand(id: string): void {
    if (this.expandedFileId === id) {
      this.expandedFileId = null;
      this.fileSelected.emit(null);
    } else {
      this.expandedFileId = id;
      const selectedFile = this.fileList.find((f) => f.id === id) || null;
      this.fileSelected.emit(selectedFile);
    }
  }

  /**
   * Triggers the edit event for the specified file.
   * Delegates the actual routing or editing logic to the parent component.
   *
   * @param id - The unique identifier of the file to edit.
   */
  editFile(file: FileItem): void {
    this.fileEdited.emit(file);
  }

  /**
   * Stages a file for deletion and opens the confirmation modal.
   *
   * @param file - The file object targeted for deletion.
   */
  promptDelete(file: FileItem): void {
    this.fileToDelete = file;
    this.showDeleteModal = true;
  }

  /**
   * Confirms the deletion of the staged file.
   * Emits the `fileDeleted` event to inform the parent component
   * and subsequently closes the modal.
   */
  confirmDelete(): void {
    if (this.fileToDelete) {
      this.fileDeleted.emit(this.fileToDelete);
      this.cancelDelete();
    }
  }

  /**
   * Cancels the deletion process, clearing the staged file and closing the modal.
   */
  cancelDelete(): void {
    this.showDeleteModal = false;
    this.fileToDelete = null;
  }
}
