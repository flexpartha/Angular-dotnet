import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserListResponse, User } from '../models/user-list.interface';
import { API_BASE_URL } from '../../app.config';

interface ApiResponse<T> {
    status: number;
    message: string;
    data: T;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private _http = inject(HttpClient);
    private _baseUrl = inject(API_BASE_URL);

    getUsers(): Observable<UserListResponse> {
        return this._http.get<UserListResponse>(`${this._baseUrl}/users`);
    }

    getUserById(id: number): Observable<ApiResponse<User>> {
        return this._http.get<ApiResponse<User>>(`${this._baseUrl}/users/${id}`);
    }

    createUser(user: Omit<User, 'id'>): Observable<ApiResponse<User>> {
        return this._http.post<ApiResponse<User>>(`${this._baseUrl}/users`, user);
    }

    updateUser(id: number, user: User): Observable<ApiResponse<User>> {
        return this._http.put<ApiResponse<User>>(`${this._baseUrl}/users/${id}`, user);
    }

    deleteUser(id: number): Observable<ApiResponse<void>> {
        return this._http.delete<ApiResponse<void>>(`${this._baseUrl}/users/${id}`);
    }
}