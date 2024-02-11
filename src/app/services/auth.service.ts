import { HttpHeaders } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { from, of, switchMap } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private afAuth = inject(AngularFireAuth);
    private router = inject(Router);
    private notificationsService: MatSnackBar = inject(MatSnackBar);

    constructor() {}

    private _authProcessing = false;

    get authProcessing() {
        return this._authProcessing;
    }

    set authProcessing(_val: boolean) {
        this._authProcessing = _val;
    }

    idToken: Signal<string | null | undefined> = toSignal(
        // Use authState observable with CAUTION
        // as it emits each time an auth related event happens
        // This may cause unexpected behaviours
        this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    console.warn('User is null');
                    return of(null);
                }
                return from(user.getIdToken());
            }),
        ),
    );

    //#region Auth Header functions

    getAuthHeaders(): HttpHeaders {
        const idToken = this.idToken();

        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            // Add any other headers if needed
        });
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
