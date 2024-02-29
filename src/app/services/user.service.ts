import { HttpClient } from '@angular/common/http';
import { Injectable, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
    BehaviorSubject,
    Observable,
    combineLatest,
    firstValueFrom,
    map,
    of,
    shareReplay,
    switchMap,
    zip,
} from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ProfileUser, UserRole } from '../models/user';
import { AuthService } from './auth.service';
import { FileUploadService } from './file-upload.service';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private API_URL = environment.apiUrl;

    private currentUserSlim$: Observable<any | null>;
    currentUserSlim: Signal<ProfileUser | null>;

    constructor(
        private http: HttpClient,
        private afAuth: AngularFireAuth,
        private afStorage: AngularFireStorage,
        private authService: AuthService,
        private fileUploadService: FileUploadService,
    ) {
        this.currentUserSlim$ = this.afAuth.authState.pipe(
            map((user) =>
                user
                    ? {
                          uid: user?.uid,
                          email: user?.email,
                          displayName: user?.displayName,
                      }
                    : null,
            ),
            shareReplay({ bufferSize: 1, refCount: true }),
        );

        this.currentUserSlim = toSignal(this.currentUserSlim$);
    }

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

    updateUserById(uid: string, newUser: ProfileUser): Observable<any> {
        const url = this.getProfilePicturePath(uid);
        const headers = this.authService.getAuthHeaders();

        return this.http.put<any>(url, newUser, { headers });
    }

    /**
     *
     * @param userId User to be updated
     * @param image Image File
     * @returns Promise that resolved to image download url
     */
    async uploadProfilePicture(userId: string, image: File): Promise<string> {
        const imagePath = `images/profile/${userId}`;

        // Reference to storage bucket
        const ref = this.afStorage.ref(imagePath);

        const uploadTask = this.afStorage.upload(imagePath, image);

        await uploadTask;

        return firstValueFrom(ref.getDownloadURL());
    }

    deleteUser(): Observable<any> {
        const user = this.currentUser();

        if (!user) {
            throw new Error('No authenticated user');
        }

        // Delete user data from MongoDB
        const deleteMongoData$ = this.deleteUserData(user.uid);

        // Delete profile picture
        const profilePicturePath = this.getProfilePicturePath(user.uid ?? '');
        const deleteProfilePicture$ =
            this.fileUploadService.deleteFile(profilePicturePath);

        // Delete user from Firebase Authentication
        const deleteUserAuth$ = this.authService.deleteUser();

        // TODO: Make sure we delete all the resources belonging to a user (like owned restaurant images)

        // Emit once both observables emit a value.
        // Can't use forkJoin because firebase observable never completes
        // https://stackoverflow.com/a/42243856
        return zip([deleteMongoData$, deleteProfilePicture$, deleteUserAuth$]);
    }

    private deleteUserData(uid) {
        const deleteUrl = `${environment.apiUrl}/api/users/${uid}`;
        const headers = this.authService.getAuthHeaders();

        return this.http.delete(deleteUrl, {
            headers,
        });
    }

    getCurrentRole(): UserRole | undefined {
        return this.currentUser()?.role;
    }

    getProfilePicturePath(uid: string) {
        return `images/profile/${uid}`;
    }
}
