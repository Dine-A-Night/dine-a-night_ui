import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, config, firstValueFrom, map } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileUser } from '../models/user';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user$: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private notificationsService: MatSnackBar,
        private userService: UserService,
        private afStorage: AngularFireStorage,
    ) {
        // Get the auth state
        this.user$ = afAuth.authState;
    }

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

    getIdToken() {
        return this.afAuth.authState.pipe(
            // Using map to transform the user to the ID token
            map((user) => (user ? user.getIdToken() : null)),
        );
    }

    userState() {
        return this.user$;
    }
}
