import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { CreateRoutePageComponent } from './pages/create-route-page/create-route-page.component';
import { EditRoutePageComponent } from './pages/edit-route-page.component/edit-route-page.component';

export const routes: Routes = [
  // When the user goes to "your-website.com/main", load the MainPage
  {
    path: 'main-page',
    component: MainPageComponent,
  },
  // When the user goes to "your-website.com/create-route", load the CreateRoutePage
  {
    path: 'create-route-page',
    component: CreateRoutePageComponent,
  },
  // When the user goes to "your-website.com/edit-route", load the CreateRoutePage
  {
    path: 'edit-route-page',
    component: EditRoutePageComponent,
  },
  // Default fallback: If they just type "your-website.com", redirect them to /main
  { path: '', redirectTo: '/main-page', pathMatch: 'full' },

  // Wildcard fallback: If they type a URL that doesn't exist, redirect to /main
  { path: '**', redirectTo: '/main-page' },
];
