import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import {
  AuthRequest,
  AuthResponse,
  CurrentUserResponse,
} from '@core/interfaces/auth/auth.interface';
import { API_URL } from '@core/utils/api';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly apiUrl = `${API_URL}/auth`;

  // Signal reactiva para almacenar el usuario autenticado actual
  currentUser = signal<CurrentUserResponse | null>(null);

  // Historial de navegación para manejar las redirecciones inteligentes
  private history: string[] = [];

  constructor() {
    // Escuchar los eventos de finalización de navegación para construir el historial
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.history.push(event.urlAfterRedirects);
        // Mantener solo los últimos 10 elementos en el historial
        if (this.history.length > 10) {
          this.history.shift();
        }
      });

    // Cargar el usuario actual si el token existe al iniciar la aplicación
    if (this.isAuthenticated()) {
      this.loadCurrentUser().subscribe();
    }
  }

  /**
   * Realiza la solicitud de inicio de sesión.
   * Guarda los tokens de acceso y refresco en local storage y carga la información del usuario.
   */
  login(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((res) => {
        localStorage.setItem('access_token', res.accessToken);
        localStorage.setItem('refresh_token', res.refreshToken);
      }),
      tap(() => {
        // Cargar inmediatamente la información del usuario tras iniciar sesión con éxito
        this.loadCurrentUser().subscribe();
      }),
    );
  }

  /**
   * Carga la información detallada del usuario logueado actualmente.
   */
  loadCurrentUser(): Observable<CurrentUserResponse> {
    return this.http
      .get<CurrentUserResponse>(`${this.apiUrl}/current-user`)
      .pipe(
        tap((user) => {
          this.currentUser.set(user);
        }),
      );
  }

  /**
   * Elimina la sesión del usuario del almacenamiento local.
   */
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.currentUser.set(null);
    this.router.navigate(['/auth/ingresar']);
  }

  /**
   * Indica si el usuario está autenticado comprobando la presencia del token.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtiene el token de acceso
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Obtiene la ruta anterior en el historial de navegación que no corresponda a páginas de autenticación.
   * Si la página anterior fue el registro, retorna '/'.
   * Si fue un path libre como '/', o '/menu...', retorna ese path.
   * De lo contrario, por defecto retorna '/'.
   */
  getPreviousUrl(): string {
    const authPaths = ['/auth/ingresar', '/auth/registrarse'];

    // Recorrer el historial de atrás hacia adelante empezando antes del actual
    for (let i = this.history.length - 2; i >= 0; i--) {
      const url = this.history[i];
      const isAuthPath = authPaths.some((path) => url.startsWith(path));

      if (!isAuthPath) {
        // Retornar el path si es un path libre (landing o menú)
        const isFreePath = url === '/' || url.startsWith('/menu');
        if (isFreePath) {
          return url;
        }
      }
    }

    return '/';
  }
}
