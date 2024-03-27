import { Component, Signal, effect, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ReAuthenticateDialogComponent } from 'src/app/components/auth/re-authenticate-dialog/re-authenticate-dialog.component';
import { ProfileUser } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'user-management-page',
    templateUrl: './user-management-page.component.html',
    styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent {
    // Services
    userService = inject(UserService);
    authService = inject(AuthService);
    afAuth = inject(AngularFireAuth);
    fb = inject(FormBuilder);
    router = inject(Router);
    dialog = inject(MatDialog);

    // Props
    currentUser: Signal<ProfileUser | null> = this.userService.currentUser;
    personalDetailsForm: FormGroup;

    constructor(private notificationService: MatSnackBar) {
        effect(() => {
            if (this.currentUser() && !isDefNotNull(this.personalDetailsForm))
                this.initForm();
        });
    }

    get profilePictureUrl() {
        const currentUser = this.userService.currentUser();

        return (
            currentUser?.profilePictureUrl ||
            UserService.DEFAULT_PROFILE_PHOTO_URI
        );
    }

    initForm() {
        this.personalDetailsForm = this.fb.group({
            firstName: [this.currentUser()?.firstName, [Validators.required]],
            lastName: [this.currentUser()?.lastName, [Validators.required]],
            phone: [
                this.currentUser()?.phone,
                [
                    Validators.required,
                    Validators.pattern(/^\d*$/),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            role: [this.currentUser()?.role, [Validators.required]],
        });
    }

    updateUserData() {
        const newUser = new ProfileUser({
            uid: this.currentUser()?.uid,
            email: this.currentUser()?.email,
            profilePictureUrl: this.currentUser()?.profilePictureUrl,
            ...this.personalDetailsForm.value,
        });

        this.userService
            .updateUserById(this.currentUser()?.uid!, newUser)
            .subscribe({
                next: (res) => {
                    this.userService.userDataUpdated.next(true);

                    this.notificationService.open(
                        'User updated successfully!',
                        'Ok',
                        {
                            duration: 3000,
                            panelClass: ['success-snackbar'],
                        },
                    );
                },
                error: (err) => {
                    this.notificationService.open(
                        "Couldn't update the user!",
                        'Oops',
                        {
                            duration: 3000,
                            panelClass: ['fail-snackbar'],
                        },
                    );
                    console.error(err);
                },
            });
    }

    get saveDisabled(): boolean {
        const firstNameUnchanged =
            this.personalDetailsForm?.get('firstName')?.value ===
            this.currentUser()?.firstName;
        const lastNameUnchanged =
            this.personalDetailsForm?.get('lastName')?.value ===
            this.currentUser()?.lastName;
        const phoneUnchanged =
            this.personalDetailsForm?.get('phone')?.value ===
            this.currentUser()?.phone;
        const roleUnchanged =
            this.personalDetailsForm?.get('role')?.value ===
            this.currentUser()?.role;

        const dataUnchanged =
            firstNameUnchanged &&
            lastNameUnchanged &&
            phoneUnchanged &&
            roleUnchanged;

        return (
            this.personalDetailsForm.pristine ||
            dataUnchanged ||
            this.personalDetailsForm.invalid
        );
    }

    deleteAccount() {
        this.openReauthenticateDialog()
            .afterClosed()
            .subscribe({
                next: (result) => {
                    if (result) {
                        this.userService.deleteUser().subscribe({
                            next: () => {
                                this.notificationService.open(
                                    'Account successfully deleted!',
                                    'Ok',
                                    {
                                        duration: 3000,
                                        panelClass: ['success-snackbar'],
                                    },
                                );

                                this.router.navigate(['/login']);
                            },
                            error: (err) => {
                                this.notificationService.open(
                                    'Failed to Delete Account: ' + err.message,
                                    'Oops',
                                    {
                                        duration: 3000,
                                        panelClass: ['fail-snackbar'],
                                    },
                                );
                                console.error(err);
                            },
                        });
                    }
                },
                error: (err) => {
                    this.notificationService.open(
                        'Failed to reauthenticate: ' + err.message,
                        'Oops',
                        {
                            duration: 3000,
                            panelClass: ['fail-snackbar'],
                        },
                    );
                    console.error(err);
                },
            });
    }

    //#region Image Upload

    async uploadProfilePicture(event) {
        const file = event.target.files[0];

        const userInfo = this.currentUser();

        if (!file || !userInfo) {
            return;
        }

        const downloadUrl = await this.userService.uploadProfilePicture(
            userInfo?.uid!,
            file,
        );

        // Update the current user with profile image url
        this.userService
            .updateUserById(userInfo?.uid!, {
                ...userInfo,
                profilePictureUrl: downloadUrl,
            })
            .subscribe({
                next: (res) => {
                    this.userService.userDataUpdated.next(true);
                    this.notificationService.open(
                        'Image Uploaded Successfully!',
                        undefined,
                        {
                            duration: 3000,
                            panelClass: ['success-snackbar'],
                        },
                    );
                    // location.reload();
                    // this.cd.detectChanges();
                },
                error: (err) => {
                    this.notificationService.open(
                        'Failed to upload the image!',
                        undefined,
                        {
                            duration: 3000,
                            panelClass: ['fail-snackbar'],
                        },
                    );
                    console.error(err);
                },
            });
    }

    openReauthenticateDialog(): MatDialogRef<ReAuthenticateDialogComponent> {
        const dialogRef = this.dialog.open(ReAuthenticateDialogComponent, {
            autoFocus: true,
            backdropClass: ['bg-red-100', 'opacity-20'],
        });

        return dialogRef;
    }

    //#endregion
}
