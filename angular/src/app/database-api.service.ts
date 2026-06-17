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

export interface AuthResponse {
  status: 'ok' | 'error';
  message?: string;
  user?: {
    id: number;
    email: string;
    nick: string;
    rol: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseApiService {
  private readonly http = inject(HttpClient);

  getHealth(): Observable<DatabaseHealthResponse> {
    return this.http.get<DatabaseHealthResponse>('api/health.php');
  }
  register(payload: { email: string; password: string; nick: string; rol: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/auth/register.php', payload);
  }

  login(payload: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/auth/login.php', payload);
  }
}