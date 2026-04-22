import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./user-load/user-load').then((m) => m.UserLoad),
        children: [
            {
                path: '',
                loadComponent: () => import('./userlist/userlist').then((m) => m.Userlist),
            },
            {
                path: 'adduser',
                loadComponent: () => import('./adduser/adduser').then((m) => m.Adduser),
            },
            {
                path: 'edituser/:id',
                loadComponent: () => import('./edituser/edituser').then((m) => m.Edituser),
            },
        ]
    },
];