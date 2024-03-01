import { HttpHeaders } from '@angular/common/http';
import { Injectable, Signal, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthCredential } from 'firebase/auth';
import {
    Observable,
    filter,
    firstValueFrom,
    from,
    map,
    of,
    switchMap,
    take,
} from 'rxjs';

// Use authState observable with CAUTION
// as it emits each time an auth related event happens
// This may cause unexpected behaviours
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

    idToken: Signal<string | null | undefined> = toSignal(this.afAuth.idToken);

    //#region Auth Header functions

    getAuthHeaders(): HttpHeaders {
        const idToken = this.idToken();

        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
            // Add any other headers if needed
        });
    }

    authHeadersObservable(): Observable<HttpHeaders> {
        return this.afAuth.idToken.pipe(
            filter((token) => {
                return token !== undefined && token !== null;
            }),
            map((token) => {
                return new HttpHeaders({
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                });
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

    deleteUser() {
        return this.afAuth.authState.pipe(
            switchMap((user) => {
                if (!user) {
                    // If there's no authenticated user, return an observable that emits null
                    return of(null);
                }
                // Return an observable that emits the promise returned by user?.delete()
                return from(user.delete());
            }),
        );
    }

    reauthenticate(credential: AuthCredential) {
        return firstValueFrom(
            this.afAuth.authState.pipe(
                take(1),
                switchMap((user) => {
                    return of(user?.reauthenticateWithCredential(credential));
                }),
            ),
        );
    }
}
