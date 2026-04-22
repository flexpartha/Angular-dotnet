import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../auth.store';

export const authInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
    const authStore = inject(AuthStore);
    let token = authStore.token();

    // if (!token) {
    //     const stored = localStorage.getItem('auth_token');
    //     if (!stored) return next(req);
    //     token = stored;
    // }
    if (token) {
        //localStorage.getItem('auth_token');
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
        return next(cloned);
    }

    return next(req);
};