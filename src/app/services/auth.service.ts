import { Injectable, OnInit, Signal, effect, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import {
    BehaviorSubject,
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
import { toSignal } from '@angular/core/rxjs-interop';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private afAuth = inject(AngularFireAuth);
    private userService = inject(UserService);
    private router = inject(Router);
    private notificationsService: MatSnackBar = inject(MatSnackBar);

    userDataUpdated = new BehaviorSubject<boolean>(true);

    private user$: Observable<any | null> = combineLatest([
        this.afAuth.authState,
        this.userDataUpdated,
    ]).pipe(
        switchMap(([user, _]) => {
            // debugger;
            if (!user) {
                return of(null);
            }

            const fullUser$ = this.userService.getUserById(user.uid);

            return combineLatest([
                of({
                    uid: user?.uid,
                    email: user?.email,
                    displayName: user?.displayName,
                }),
                fullUser$,
            ]);
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

    currentUser: Signal<ProfileUser | null> = toSignal(this.user$);

    constructor() {
        effect(() => {
            console.log(this.currentUser());
        });
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
