import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { ProfileUser } from '../models/user';
import { environment } from 'src/environments/environment.development';
import {
    BehaviorSubject,
    Observable,
    ObservableInput,
    catchError,
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
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = environment.apiUrl;

    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afStorage: AngularFireStorage,
        private authService: AuthService,
    ) {}

    userDataUpdated = new BehaviorSubject<boolean>(true);

    private user$: Observable<any | null> = combineLatest([
        this.afAuth.authState,
        this.userDataUpdated,
    ]).pipe(
        switchMap(([user, _]) => {
            if (!user) {
                return of(null);
            }

            if (!this.authService.authProcessing) {
                const fullUser$ = this.getUserById(user.uid);

                return combineLatest([
                    of({
                        uid: user?.uid,
                        email: user?.email,
                        displayName: user?.displayName,
                    }),
                    fullUser$,
                ]);
            }

            return of(null);
        }),
        map((data) => {
            if (!data) {
                return null;
            }

            const [firebaseUser, mongoUser] = data;

            // Merge the properties from both objects
            return { ...firebaseUser, ...mongoUser?.user };
        }),
    );

    /**
     * Current logged in user data (firebase and mongo combined)
     */
    currentUser: Signal<ProfileUser | null> = toSignal(this.user$);

    async register(email: string, password: string, userInfo: ProfileUser) {
        // The caller should handle any exceptions thrown by this function
        const res = await this.afAuth.createUserWithEmailAndPassword(
            email,
            password,
        );

        this.authService.authProcessing = true;

        await res.user?.updateProfile({
            displayName: `${userInfo.firstName} ${userInfo.lastName}`,
        });

        // Other Details go to MongoDB
        await firstValueFrom(
            this.createUserProfile({
                ...userInfo,
                uid: res.user?.uid,
                email: res.user?.email!,
            }),
        );

        this.authService.authProcessing = false;

        this.userDataUpdated.next(true);

        return res;
    }

    createUserProfile(user: ProfileUser): Observable<any> {
        const postUrl = `${this.API_URL}/api/users`;
        const headers = this.authService.getAuthHeaders();

        return this.http.post<any>(postUrl, user, { headers });
    }

    getUserById(uid: string): Observable<any> {
        const url = `${this.API_URL}/api/users/${uid}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.get<any>(url, { headers });
    }

    getRestaurants() {
        const url = `${this.API_URL}/api/restaurants`;

        return this.http.get<any>(url);
    }

    updateUserById(uid: string, newUser: ProfileUser): Observable<any> {
        const url = `${this.API_URL}/api/users/${uid}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.put<any>(url, newUser, { headers });
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
        const headers = this.authService.getAuthHeaders();

        return this.http.delete(deleteUrl, {
            headers,
        });
    }
}
