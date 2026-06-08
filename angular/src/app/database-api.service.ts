import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DatabaseHealthResponse {
  status: 'ok' | 'error';
  database: string;
  tables?: number;
  serverVersion?: string | null;
  checkedAt?: string;
  message?: string;
  detail?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseApiService {
  private readonly http = inject(HttpClient);

  getHealth(): Observable<DatabaseHealthResponse> {
    return this.http.get<DatabaseHealthResponse>('http://localhost/angular/api/health.php');
  }
}
