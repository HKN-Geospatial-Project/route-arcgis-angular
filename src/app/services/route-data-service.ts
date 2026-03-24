import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RouteResponseDTO } from '../models/dtos/route-response.dto';
import { tap } from 'rxjs';
import { RoutePointDto as PointDto } from '../models/dtos/route-point.dto';

@Injectable({
  providedIn: 'root',
})
export class RouteDataService {
  private apiUrl = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) {}

  save(name: string, points: PointDto[]) {
    console.log(name + '; ' + points);
    return this.httpClient.post<RouteResponseDTO>(this.apiUrl + '/routes', { name, points }).pipe(
      tap((value) => {
        sessionStorage.setItem('id', value.id.toString());
        sessionStorage.setItem('name', value.name);
        sessionStorage.setItem('points', JSON.stringify(value.points));
      }),
    );
  }
}
