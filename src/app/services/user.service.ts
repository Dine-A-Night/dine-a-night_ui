import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileUser } from '../models/user';
import { environment } from 'src/environments/environment.development';
import { Observable, from, map, switchMap, throwError } from 'rxjs';
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

    createUserProfile(user: ProfileUser): Observable<any> {
        const postUrl = `${this.API_URL}/api/users`;

        // Getting the ID token from AngularFire
        return this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    // Handle the case where user is null
                    return throwError(() => 'User is null');
                }

                // Use from to convert the promise to an observable
                return from(user.getIdToken());
            }),
            switchMap((idToken) => {
                // Creating headers with the ID token
                const headers = new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${idToken}`,
                    // Add any other headers if needed
                });

                // Making the HTTP POST request with headers
                return this.http.post<any>(postUrl, user, { headers });
            }),
        );
    }
}
