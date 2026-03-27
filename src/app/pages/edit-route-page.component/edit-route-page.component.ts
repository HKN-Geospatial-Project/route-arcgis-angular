import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'edit-route-page',
  imports: [],
  templateUrl: './edit-route-page.component.html',
  styleUrl: './edit-route-page.component.css',
})
export class EditRoutePageComponent {
  /** Service for programmatic page navigation. */
  private router = inject(Router);

  /** Navigates back to the main page. */
  public goBack(): void {
    this.router.navigate(['/main-page']);
  }
}
