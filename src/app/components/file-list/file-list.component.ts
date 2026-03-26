import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

interface RouteFile {
  id: string;
  name: string;
  createdAt: Date;
}

@Component({
  selector: 'component-file-list',
  standalone: true,
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css'],
})
export class FileListComponent {
  @Input() fileList: RouteFile[] = [
    { id: '1', name: 'Route_Alpha.json', createdAt: new Date() },
    { id: '2', name: 'Route_Beta.json', createdAt: new Date() },
    { id: '3', name: 'Route_Gamma.json', createdAt: new Date() },
  ];

  @Output() fileSelected = new EventEmitter<RouteFile | null>();

  showDeleteModal: boolean = false;
  fileToDelete: RouteFile | null = null;
  expandedFileId: string | null = null;

  constructor(private router: Router) {}

  // NEW: Toggle expansion logic
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

  editFile(id: string): void {
    this.router.navigate(['/edit', id]);
  }

  promptDelete(file: RouteFile): void {
    this.fileToDelete = file;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.fileToDelete) {
      this.fileList = this.fileList.filter((f) => f.id !== this.fileToDelete!.id);
      this.cancelDelete();
    }
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.fileToDelete = null;
  }
}
