import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, tap, catchError, of, finalize, switchMap } from 'rxjs';
import { UserService } from './service/user-service';
import { User } from './models/user-list.interface';

interface UserDetailState {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
    successMessage: string | null;
}

const initialUserState: UserDetailState = {
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
    successMessage: null,
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialUserState),
    withComputed((store) => ({
        users: () => store.users(),
        selectedUser: () => store.selectedUser(),
        loading: () => store.loading(),
        error: () => store.error(),
        successMessage: () => store.successMessage(),
    })),
    withMethods(
        (store) => {
            const userService = inject(UserService);
            const router = inject(Router);

            return {
                loadUsers: rxMethod<void>(
                    pipe(
                        tap(() => {
                            patchState(store, { loading: true, error: null });
                        }),
                        switchMap(() =>
                            userService.getUsers().pipe(
                                tap((response) => {
                                    patchState(store, {
                                        users: response.data,
                                        loading: false,
                                        error: null,
                                    });
                                }),
                                catchError((error) => {
                                    patchState(store, {
                                        loading: false,
                                        error: error.error?.message || 'Failed to load users',
                                    });
                                    return of(error);
                                })
                            )
                        )
                    )
                ),

                addUser: rxMethod<{ user: Omit<User, 'id'> }>(
                    pipe(
                        tap(() => {
                            patchState(store, { loading: true, error: null });
                        }),
                        switchMap(({ user }) =>
                            userService.createUser(user).pipe(
                                tap((response) => {
                                    patchState(store, {
                                        users: [...store.users(), response.data],
                                        loading: false,
                                        successMessage: 'User added successfully',
                                        error: null,
                                    });
                                    router.navigate(['/userlist']);
                                }),
                                catchError((error) => {
                                    patchState(store, {
                                        loading: false,
                                        error: error.error?.message || 'Failed to add user',
                                    });
                                    return of(error);
                                })
                            )
                        )
                    )
                ),

                updateUser: rxMethod<{ user: User }>(
                    pipe(
                        tap(() => {
                            patchState(store, { loading: true, error: null });
                        }),
                        switchMap(({ user }) =>
                            userService.updateUser(user.id, user).pipe(
                                tap((response) => {
                                    patchState(store, {
                                        users: store.users().map((u) =>
                                            u.id === user.id ? response.data : u
                                        ),
                                        selectedUser: null,
                                        loading: false,
                                        successMessage: 'User updated successfully',
                                        error: null,
                                    });
                                    router.navigate(['/userlist']);
                                }),
                                catchError((error) => {
                                    patchState(store, {
                                        loading: false,
                                        error: error.error?.message || 'Failed to update user',
                                    });
                                    return of(error);
                                })
                            )
                        )
                    )
                ),

                deleteUser: rxMethod<{ id: number }>(
                    pipe(
                        tap(() => {
                            patchState(store, { loading: true, error: null });
                        }),
                        switchMap(({ id }) =>
                            userService.deleteUser(id).pipe(
                                tap(() => {
                                    patchState(store, {
                                        users: store.users().filter((u) => u.id !== id),
                                        loading: false,
                                        successMessage: 'User deleted successfully',
                                        error: null,
                                    });
                                }),
                                catchError((error) => {
                                    patchState(store, {
                                        loading: false,
                                        error: error.error?.message || 'Failed to delete user',
                                    });
                                    return of(error);
                                })
                            )
                        )
                    )
                ),

                setSelectedUser: (user: User | null) => {
                    patchState(store, { selectedUser: user });
                },

                clearMessages: () => {
                    patchState(store, { error: null, successMessage: null });
                },
            };
        }
    )
);