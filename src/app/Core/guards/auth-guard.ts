import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = (route, state) => {

  const tokenService = inject(TokenService);

  const router = inject(Router);

  const login =
    tokenService.isLoggedIn();

  if (login) {
    return true;
  }

  tokenService.clear();

  router.navigate(['/login']);

  return false;

};
