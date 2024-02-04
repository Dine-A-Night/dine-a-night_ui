import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Observable, config } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private user$: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private router: Router,
        private notificationsService: MatSnackBar,
        private afStorage: AngularFireStorage,
    ) {
        // Get the auth state
        this.user$ = afAuth.authState;
    }

    login(email: string, password: string) {
        return this.afAuth.signInWithEmailAndPassword(email, password);
    }

    async register(email: string, password: string, userInfo: User) {
        // The caller should handle any exceptions thrown by this function
        const res = await this.afAuth.createUserWithEmailAndPassword(
            email,
            password,
        );

        await res.user?.updateProfile({
            displayName: `${userInfo.firstName} ${userInfo.lastName}`,
        });

        // Other Details go to MongoDB

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
