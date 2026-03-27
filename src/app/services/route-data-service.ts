// Angular Core Imports
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Application Core Imports
import { RoutePointDto as PointDto } from '../models/dtos/route-point.dto';
import { RouteResponseDTO } from '../models/dtos/route-response.dto';

/**
 * Service responsible for performing CRUD operations on route data via HTTP.
 */
@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  /** Base URL for the routes API endpoint. */
  private apiUrl = 'http://localhost:8080/public/routes';

  /** Angular HttpClient for making RESTful requests. */
  private httpClient = inject(HttpClient);

  /**
   * Persists a new route to the database.
   * @param name - The user-defined name for the route.
   * @param points - An array of geographic points (latitude, longitude, etc.).
   * @returns An Observable of the created RouteResponseDTO.
   */
  public create(name: string, points: PointDto[]) {
    const payload = { name, points };
    return this.httpClient.post<RouteResponseDTO>(this.apiUrl, payload);
  }

  /**
   * Retrieves a single route record by its unique identifier.
   * @param id - The ID of the route to fetch.
   * @returns An Observable of the specific RouteResponseDTO.
   */
  public getById(id: number | string): Observable<RouteResponseDTO> {
    return this.httpClient.get<RouteResponseDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Retrieves all saved routes from the database.
   * @returns An Observable containing an array of RouteResponseDTOs.
   */
  public getAll(): Observable<RouteResponseDTO[]> {
    return this.httpClient.get<RouteResponseDTO[]>(this.apiUrl);
  }

  /**
   * Updates an existing route with new data.
   * @param id - The ID of the route to modify.
   * @param name - The updated name for the route.
   * @param points - The updated array of route points.
   * @returns An Observable of the updated RouteResponseDTO.
   */
  public update(
    id: number | string,
    name: string,
    points: PointDto[],
  ): Observable<RouteResponseDTO> {
    const payload = { name, points };
    return this.httpClient.put<RouteResponseDTO>(`${this.apiUrl}/${id}`, payload);
  }

  /**
   * Removes a route record from the database.
   * @param id - The ID of the route to delete.
   * @returns An Observable that completes when the deletion is successful.
   */
  public delete(id: number | string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }
}
