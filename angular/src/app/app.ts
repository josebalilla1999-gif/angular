import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatabaseApiService, DatabaseHealthResponse } from './database-api.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly databaseApi = inject(DatabaseApiService);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly health = signal<DatabaseHealthResponse | null>(null);
  protected readonly error = signal<string | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isConnected = computed(() => this.health()?.status === 'ok' && !this.error());
  protected readonly statusText = computed(() => {
    if (this.isLoading()) {
      return 'Comprobando';
    }

    return this.isConnected() ? 'Conectado' : 'Sin conexion';
  });
  protected readonly checkedAtText = computed(() => {
    const checkedAt = this.health()?.checkedAt;

    if (!checkedAt) {
      return 'Pendiente';
    }

    return new Intl.DateTimeFormat('es-ES', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(checkedAt));
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.checkConnection();
    }
  }

  protected checkConnection(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.databaseApi.getHealth().subscribe({
      next: (health) => {
        this.health.set(health);
        this.isLoading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.health.set(null);
        this.error.set(this.describeError(error));
        this.isLoading.set(false);
      },
    });
  }

  private describeError(error: HttpErrorResponse): string {
    if (error.error?.detail) {
      return error.error.detail;
    }

    if (error.error?.message) {
      return error.error.message;
    }

    return error.message || 'No se pudo contactar la API PHP.';
  }
}
