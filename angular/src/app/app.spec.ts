import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.inject(HttpTestingController).verify();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    flushDatabaseHealth();

    expect(app).toBeTruthy();
  });

  it('should render the database connection status', async () => {
    const fixture = TestBed.createComponent(App);
    flushDatabaseHealth();
    fixture.detectChanges();

    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Sistema de reservaciones');
    expect(compiled.textContent).toContain('Conectado');
  });
});

function flushDatabaseHealth(): void {
  TestBed.inject(HttpTestingController).expectOne('angular/api/health.php').flush({
    status: 'ok',
    database: 'sistema_reservaciones',
    tables: 0,
    serverVersion: 'local',
    checkedAt: '2026-06-08T10:00:00+00:00',
  });
}
