import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { AuthStore } from './auth.store';

// export const canActivateAuth: CanActivateFn = () => {
//     const authStore = inject(AuthStore);
//     const router = inject(Router);

//     if (authStore.isAuthenticated()) {
//         return true;
//     }

//     return router.createUrlTree(['/login']);
// };

export const canLoadGuard: CanMatchFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.isAuthenticated()) {
        return true;
    }
    const token = localStorage.getItem('auth_token');
    return router.createUrlTree(['/login']);
};