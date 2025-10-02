import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

type CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => boolean;
export const authguardGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const userData = JSON.parse(localStorage.getItem("too_auth_user")!);
    const router = inject(Router)
    if (userData.length > 0) {
        return true;
    } else {
        router.navigate(['login']);
        return false;
    }
};

































// import {Injectable} from '@angular/core';
// import {CanActivateFn, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from '@angular/router';
// @Injectable({
//     providedIn: 'root'
// })
// export class RedirectGuard implements CanActivateFn {
//   constructor(private router: Router) {}
//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//       window.location.href = route.data['externalUrl'];
//       return true;
//   }
// }

// import { CanActivateFn, Router, RouterLink, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// export const authguardGuard: CanActivateFn = (router: Router,state: RouterStateSnapshot) => {
//     const userData = JSON.parse(localStorage.getItem("too_auth_user")!);
//     // console.log(state,'state')
//     if (userData) {
//         return true
//     } else {
//         // router.navigate(['login']);
//         // state.root.children[0].parent?.router.navigate(['login']);
//         return false
//     }

// };
