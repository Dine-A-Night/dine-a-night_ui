import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of, switchMap, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

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

    async logout() {
        await this.afAuth.signOut();
    }

    userState() {
        return this.user$;
    }
}
