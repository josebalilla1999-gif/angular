import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vuelo } from '../vuelos/vuelos.model';

@Injectable({
  providedIn: 'root'
})
export class VuelosService {

  private apiUrl = '/api/vuelos.php';

  constructor(private http: HttpClient) {}

  obtenerVuelos(): Observable<Vuelo[]> {
    return this.http.get<Vuelo[]>(this.apiUrl);
  }
}