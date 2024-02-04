import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileUser } from '../models/user';
import { environment } from 'src/environments/environment.development';
import { Observable, from, map, of, switchMap, throwError } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
    ) {}

    //#region auth header functions

    /**
     * These functions should be used from auth service instead for any other services.
     * We have duplicates here in order to avoid circualr dependency error.
     * See https://angular.io/errors/NG0200
     */

    private getIdToken(): Observable<string> {
        return this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    return throwError(() => 'User is null');
                }
                return from(user.getIdToken());
            }),
        );
    }

    private getAuthHeaders(): Observable<HttpHeaders> {
        return this.getIdToken().pipe(
            switchMap((idToken) => {
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                    // Add any other headers if needed
                });
                return of(headers);
            }),
        );
    }

    //#endregion

    createUserProfile(user: ProfileUser): Observable<any> {
        const postUrl = `${this.API_URL}/api/users`;

        return this.getAuthHeaders().pipe(
            switchMap((headers) => {
                return this.http.post<any>(postUrl, user, { headers });
            }),
        );
    }

    getUserById(uid: string): Observable<any> {
        const url = `${this.API_URL}/api/users/${uid}`;

        return this.getAuthHeaders().pipe(
            switchMap((headers) => {
                return this.http.get<any>(url, { headers });
            }),
        );
    }
}
