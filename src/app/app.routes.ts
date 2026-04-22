import { Routes } from '@angular/router';
import { AUTH_ROUTES } from './auth/auth.routes';
import { USER_ROUTES } from './user-detail/user.routes';
import { canLoadGuard } from './auth/can-load.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: 'login',
        loadChildren: () => import('./auth/auth.routes').then((m) => m.AUTH_ROUTES),
    },
    {
        path: 'userlist',
        canMatch: [canLoadGuard],
        loadChildren: () => import('./user-detail/user.routes').then((m) => m.USER_ROUTES)
    }
];
