import { inject } from '@angular/core';
import { Router, type ActivatedRouteSnapshot, type CanActivateFn, type RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const anonymUrls = ['/login', '/register'];
  const authService = inject(AuthService);
  const router = inject(Router); // 👈 necesario para redirigir

  return authService.isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (!isLoggedIn ) {
        // Puedes usar window.location.href o router.navigate
        // router.navigate(['/'], { queryParams: { redirectTo: state.url } });
        router.navigateByUrl('/');
        return false;
      }
      return true;
    })
  );
};
