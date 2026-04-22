import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, finalize, switchMap } from 'rxjs';
import { Authservice } from './service/authservice';
import { User } from './models/user.interface';

interface AuthState {
    user: User | null;
    errorMessage: string | null;
    successMessage: string | null;
    statusCode: number | null;
    isLoading: boolean;
}

const TOKEN_KEY = 'auth_token';

const getStoredToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

const initialState: AuthState = {
    user: null,
    errorMessage: null,
    successMessage: null,
    statusCode: null,
    isLoading: false,
};

export const AuthStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed((store) => ({
        isAuthenticated: () => !!store.user(),
        user: () => store.user(),
        username: () => store.user()?.username ?? 'No username',
        token: () => store.user()?.token,
        errorMessage: () => store.errorMessage(),
        successMessage: () => store.successMessage(),
        isLoading: () => store.isLoading(),
        authMessage: () => ({
            message: store.statusCode() && store.statusCode()! >= 200 && store.statusCode()! < 300
                ? store.successMessage()
                : store.errorMessage(),
            statusCode: store.statusCode(),
        }),
    })),
    withMethods(
        (store) => {
            const authService = inject(Authservice);
            const router = inject(Router);

            return {
                login: rxMethod<{ username: string; email: string }>(
                    pipe(
                        tap(() => {
                            patchState(store, { isLoading: true, errorMessage: null, successMessage: null });
                        }),
                        switchMap(({ username, email }) =>
                            authService.login(username, email).pipe(
                                tap((response) => {
                                    console.log('Login response:', response);
                                    // Save token to localStorage
                                    if (response.data.token) {
                                        localStorage.setItem(TOKEN_KEY, response.data.token);
                                    }
                                    patchState(store, {
                                        user: response.data,
                                        successMessage: response.message,
                                        errorMessage: null,
                                        statusCode: response.status,
                                        isLoading: false,
                                    });
                                    router.navigate(['/userlist']);
                                }),
                                catchError((error) => {
                                    const statusCode = error.status || 500;
                                    const message = error.error?.message || 'Login failed';
                                    patchState(store, {
                                        errorMessage: message,
                                        successMessage: null,
                                        statusCode,
                                        isLoading: false,
                                    });
                                    return of(error);
                                }),
                                finalize(() => patchState(store, { isLoading: false }))
                            )
                        )
                    )
                ),

                logout: () => {
                    localStorage.removeItem(TOKEN_KEY);
                    patchState(store, initialState);
                    router.navigate(['/login']);
                },

                clearMessages: () => {
                    patchState(store, { errorMessage: null, successMessage: null, statusCode: null });
                },

                // Load token from localStorage on app init
                initAuth: () => {
                    const token = getStoredToken();
                    if (token) {
                        // If you have an API to validate token and get user info, call it here
                        // For now, we just set a basic user object with the token
                        patchState(store, {
                            user: { id: 0, username: '', email: '', token: token },
                        });
                    }
                },
            };
        }
    )
);