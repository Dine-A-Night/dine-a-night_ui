import { Component, Inject, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, take } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { EmailAuthProvider } from 'firebase/auth';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 're-authenticate-dialog',
    templateUrl: './re-authenticate-dialog.component.html',
    styleUrls: ['./re-authenticate-dialog.component.scss'],
})
export class ReAuthenticateDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ReAuthenticateDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private userService: UserService,
        private authService: AuthService,
        private notificationService: MatSnackBar,
    ) {}

    passwordEntered: string;

    get currentUser() {
        return this.userService.currentUser();
    }

    get confirmDisabled() {
        return !this.passwordEntered?.length;
    }

    async checkPassword() {
        if (this.currentUser?.email) {
            const credential = EmailAuthProvider.credential(
                this.currentUser.email,
                this.passwordEntered,
            );

            try {
                const result =
                    await this.authService.reauthenticate(credential);

                this.dialogRef.close(result);
            } catch (err: any) {
                this.notificationService.open(
                    `Failed to Authenticate: ${err.message}`,
                    'Oops',
                    {
                        duration: 3000,
                    },
                );
                this.dialogRef.close(null);
            }
        }
    }
}
