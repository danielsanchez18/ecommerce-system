import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../utils/api';
import { AuthService } from '../service/auth/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access_token');
  const injector = inject(Injector);
  let apiReq = req;

  // Prepend API_URL to relative requests (starting with '/')
  if (req.url.startsWith('/')) {
    apiReq = req.clone({
      url: `${API_URL}${req.url}`,
    });
  }

  // Inject Authorization Bearer token header if present
  // No inyectar en rutas de auth para evitar conflictos con tokens expirados
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/registrarse')) {
    apiReq = apiReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend nos responde con 401, el token expiró o es inválido
      // No hacer logout si el 401 viene del intento de login (credenciales inválidas)
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        const authService = injector.get(AuthService);
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
