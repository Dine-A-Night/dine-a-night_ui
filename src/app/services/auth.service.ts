import { Injectable, OnInit, Signal, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
    Observable,
    combineLatest,
    config,
    firstValueFrom,
    from,
    map,
    of,
    switchMap,
    throwError,
} from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileUser } from '../models/user';
import { UserService } from './user.service';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private afAuth = inject(AngularFireAuth);
    private userService = inject(UserService);
    private router = inject(Router);
    private notificationsService: MatSnackBar = inject(MatSnackBar);

    private user$: Observable<any | null>;

    currentUser: Signal<ProfileUser>;

    constructor() {
        // Get the auth state
        this.user$ = this.afAuth.authState.pipe(
            switchMap((user) => {
                const fullUser$ = this.userService.getUserById(user!.uid);

                return combineLatest([
                    of({
                        uid: user?.uid,
                        email: user?.email,
                        displayName: user?.displayName,
                    }),
                    fullUser$,
                ]);
            }),
            map(([firebaseUser, mongoUser]) => {
                if (!firebaseUser) {
                    // If user is not authenticated
                    return null; // or return an empty object depending on your use case
                }

                // Merge the properties from both objects
                return { ...firebaseUser, ...mongoUser?.user };
            }),
        );

        // this.currentUser = toSignal(this.user$);
    }

    //#region Auth Header functions

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

    getAuthHeaders(): Observable<HttpHeaders> {
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

    login(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    async register(email: string, password: string, userInfo: ProfileUser) {
        // The caller should handle any exceptions thrown by this function
        const res = await this.afAuth.createUserWithEmailAndPassword(
            email,
            password,
        );

        await res.user?.updateProfile({
            displayName: `${userInfo.firstName} ${userInfo.lastName}`,
        });

        // Other Details go to MongoDB
        await firstValueFrom(
            this.userService.createUserProfile({
                ...userInfo,
                uid: res.user?.uid,
                email: res.user?.email!,
            }),
        );

        return res;
    }

    async logout() {
        try {
            await this.afAuth.signOut();

            this.notificationsService.open('Successfully logged out!', 'Ok', {
                duration: 2000,
            });
            this.router.navigate(['/logout']);
        } catch (err) {
            if (err instanceof Error) {
                this.notificationsService.open('Error: ', err.message);
            }
        }
    }

    userState() {
        return this.user$;
    }
}
