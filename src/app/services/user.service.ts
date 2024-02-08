import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfileUser } from '../models/user';
import { environment } from 'src/environments/environment.development';
import {
    Observable,
    combineLatest,
    finalize,
    firstValueFrom,
    from,
    map,
    of,
    switchMap,
    tap,
    throwError,
} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './auth.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afStorage: AngularFireStorage,
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

    updateUserById(uid: string, newUser: ProfileUser): Observable<any> {
        const url = `${this.API_URL}/api/users/${uid}`;

        return this.getAuthHeaders().pipe(
            switchMap((headers) => {
                return this.http.put<any>(url, newUser, { headers });
            }),
        );
    }

    /**
     *
     * @param userId User to be updated
     * @param image Image File
     * @returns Promise that resolved to image download url
     */
    uploadProfilePicture(userId: string, image: File): Promise<string> {
        const imagePath = `images/profile/${userId}`;

        // Reference to storage bucket
        const ref = this.afStorage.ref(imagePath);

        const uploadTask = this.afStorage.upload(imagePath, image);

        return firstValueFrom(
            uploadTask.snapshotChanges().pipe(
                tap(console.log),
                // The file's download URL
                switchMap(() => ref?.getDownloadURL()),
                switchMap((downloadURL) => {
                    // Perform any finalization logic here if needed

                    return of(downloadURL); // Return the download URL
                }),
            ),
        );
    }

    deleteUser(): Observable<any> {
        return this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    throw new Error('No authenticated user');
                }

                // Delete user data from MongoDB
                const deleteMongoData$ = this.deleteUserData(user.uid);

                // Delete user from Firebase Authentication
                const deleteUserAuth$ = from(user.delete());

                // Combine both observables
                return combineLatest([deleteMongoData$, deleteUserAuth$]);
            }),
        );
    }

    private deleteUserData(uid) {
        const deleteUrl = `${environment.apiUrl}/api/users/${uid}`;

        return this.getAuthHeaders().pipe(
            switchMap((headers) => {
                return this.http.delete(deleteUrl, {
                    headers,
                });
            }),
        );
    }
}
