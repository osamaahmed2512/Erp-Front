import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AccessStore } from '../services/access-store.service';

export const permissionGuard: CanActivateFn = route => {
  const store = inject(AccessStore);
  const router = inject(Router);
  const permission = route.data?.['permission'] as string;
  const decide = () => store.can(permission) ? true : router.createUrlTree(['/access-denied']);
  if (store.access()) return decide();
  return store.initialize().pipe(map(decide), catchError(() => of(router.createUrlTree(['/access-denied']))));
};

export const defaultRouteGuard: CanActivateFn = () => {
  const store = inject(AccessStore);
  const router = inject(Router);
  const target = () => router.createUrlTree([store.firstRoute()]);
  if (store.access()) return target();
  return store.initialize().pipe(map(target), catchError(() => of(router.createUrlTree(['/access-denied']))));
};
