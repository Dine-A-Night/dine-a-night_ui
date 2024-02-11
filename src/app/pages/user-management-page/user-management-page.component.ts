import { Component, Signal, effect, inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ProfileUser } from 'src/app/models/user';
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

        return currentUser?.profilePictureUrl?.length
            ? currentUser.profilePictureUrl
            : 'assets/images/profile.jpg';
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
                        undefined,
                        {
                            duration: 3000,
                        },
                    );
                },
                error: (err) => {
                    this.notificationService.open(
                        "Couldn't update the user!",
                        undefined,
                        {
                            duration: 3000,
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

        return this.personalDetailsForm.pristine || dataUnchanged;
    }

    deleteAccount() {
        this.userService.deleteUser().subscribe({
            next: () => {
                this.notificationService.open(
                    'Account successfully deleted!',
                    'Ok',
                    {
                        duration: 3000,
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
                        },
                    );
                    console.error(err);
                },
            });
    }

    //#endregion
}
