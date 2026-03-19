/// Angular Core Imports
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

/**
 * The primary entry point of the application.
 * This component serves as the default landing page.
 */
@Component({
  selector: 'main-page',
  standalone: true,
  imports: [],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css',
})
export class MainPageComponent {
  /** Angular Router service used for programmatic navigation between pages. */
  private router = inject(Router);

  /**
   * Navigates the user from the landing page to the route creation workflow.
   * This triggers the Angular Router to swap the 'main-page' component
   * with the 'create-route-page' within the primary router-outlet.
   */
  public navigateCreateRoutePage() {
    this.router.navigate(['/create-route-page']);
  }
}
