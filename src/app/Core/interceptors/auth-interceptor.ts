import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { LoginResponseDto } from '../../features/auth/models/login-response-dto';

// Shared single-flight refresh state across all concurrent requests.
// Prevents the refresh-token rotation race: only ONE refresh runs at a time,
// every other 401 waits for its result instead of spending the rotated token.
let isRefreshing = false;
const refreshedToken$ = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = tokenService.getToken();

  // EXCLUDE AUTH REQUESTS
  const isAuthRequest =
    req.url.includes('/Auth/login') ||
    req.url.includes('/Auth/refresh-token');

  if (isAuthRequest) {
    return next(req);
  }

  // CHECK SESSION
  if (!tokenService.isLoggedIn()) {
    tokenService.clear();
    router.navigate(['/login']);
    return throwError(() => new Error('Session expired'));
  }

  // 🔐 Add access token
  if (token) {
    const companyId = localStorage.getItem('selectedCompanyId');
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        ...(companyId ? { 'X-Company-Id': companyId } : {})
      }
    });
  }

  return next(req).pipe(
    catchError(err => {
      // 🔄 Token expired
      if (err.status === 401) {
        return handle401(req, next, tokenService, authService, router);
      }
      return throwError(() => err);
    })
  );
};

function handle401(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  tokenService: TokenService,
  authService: AuthService,
  router: Router
): Observable<HttpEvent<unknown>> {
  const refreshToken = tokenService.getRefreshToken();

  if (!refreshToken) {
    tokenService.clear();
    router.navigate(['/login']);
    return throwError(() => new Error('Session expired'));
  }

  // A refresh is already in flight → wait for the new token, then retry.
  if (isRefreshing) {
    return refreshedToken$.pipe(
      filter(t => t !== null),
      take(1),
      switchMap(newToken =>
        next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))
      )
    );
  }

  // We own the refresh.
  isRefreshing = true;
  refreshedToken$.next(null);

  return authService.refreshToken({
    token: tokenService.getToken()!,
    refreshToken: refreshToken
  }).pipe(
    switchMap((res: LoginResponseDto) => {
      tokenService.setToken(
        res.token,
        res.refreshToken,
        res.expiresAt,
        res.expiresRefreshTokenAt,
        res.sessionExpiryTime
      );

      isRefreshing = false;
      refreshedToken$.next(res.token);

      return next(req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } }));
    }),
    catchError(error => {
      isRefreshing = false;
      refreshedToken$.next(null);
      tokenService.clear();
      router.navigate(['/login']);
      return throwError(() => error);
    })
  );
}
