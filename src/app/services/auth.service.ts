import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
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
        await this.afAuth.signOut();
    }

    userState() {
        return this.user$;
    }
}
