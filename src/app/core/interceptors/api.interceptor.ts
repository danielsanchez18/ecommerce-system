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
  if (token) {
    apiReq = apiReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(apiReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Si el backend nos responde con 401, el token expiró o es inválido
      if (error.status === 401) {
        const authService = injector.get(AuthService);
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
