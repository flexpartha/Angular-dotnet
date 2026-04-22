import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginResponse } from '../models/login.interface';
import { API_BASE_URL } from '../../app.config';

@Injectable({
    providedIn: 'root',
})
export class Authservice {
    private _http = inject(HttpClient);
    private _baseUrl = inject(API_BASE_URL);

    login(username: string, email: string): Observable<LoginResponse> {
        return this._http.post<LoginResponse>(`${this._baseUrl}/auth/login`, { username, email });
    }
}