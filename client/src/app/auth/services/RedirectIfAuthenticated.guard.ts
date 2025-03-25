import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

export const redirectIfAuthenticatedGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) {
        router.navigate(['/home']);
        return false;
      }
      return true;
    })
  );
};
