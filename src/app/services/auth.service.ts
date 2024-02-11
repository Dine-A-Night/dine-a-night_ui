import { HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, from, of, switchMap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private afAuth = inject(AngularFireAuth);
    private router = inject(Router);
    private notificationsService: MatSnackBar = inject(MatSnackBar);

    constructor() {}

    //#region Auth Header functions

    private getIdToken(): Observable<string | null> {
        return this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    console.warn('User is null');
                    return of(null);
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
}
