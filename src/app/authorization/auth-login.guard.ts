import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

export const authLoginGuard: CanActivateFn = (route, state) => {
  const userData = JSON.parse(localStorage.getItem("too_auth_user")!);
  const router = inject(Router)
  if (userData == null) return true; else  return false; 
};
