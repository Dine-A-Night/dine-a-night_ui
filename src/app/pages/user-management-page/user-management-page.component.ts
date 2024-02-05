import { Component, OnInit, inject } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
    AngularFireStorage,
    AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, firstValueFrom } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'user-management-page',
    templateUrl: './user-management-page.component.html',
    styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent implements OnInit {
    // Services
    userService = inject(UserService);
    authService = inject(AuthService);
    afAuth = inject(AngularFireAuth);
    fb = inject(FormBuilder);

    // Props
    currentUser: ProfileUser;
    personalDetailsForm: FormGroup;

    constructor(private notificationService: MatSnackBar) {}

    ngOnInit(): void {
        this.populateUserData();
    }

    async populateUserData() {
        this.afAuth.authState.subscribe((state) => {
            this.userService.getUserById(state!.uid).subscribe((res) => {
                const { user } = res;

                this.currentUser = user;

                this.initForm();
                console.log(user);
            });
        });
    }

    initForm() {
        this.personalDetailsForm = this.fb.group({
            firstName: [this.currentUser.firstName, [Validators.required]],
            lastName: [this.currentUser.lastName, [Validators.required]],
            phone: [
                this.currentUser.phone,
                [
                    Validators.required,
                    Validators.pattern(/^\d*$/),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            role: [this.currentUser.role, [Validators.required]],
        });
    }

    updateUserData() {
        const newUser = new ProfileUser({
            uid: this.currentUser.uid,
            email: this.currentUser.email,
            ...this.personalDetailsForm.value,
        });

        this.userService
            .updateUserById(this.currentUser.uid!, newUser)
            .subscribe({
                next: () => {
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
            this.currentUser.firstName;
        const lastNameUnchanged =
            this.personalDetailsForm?.get('lastName')?.value ===
            this.currentUser.lastName;
        const phoneUnchanged =
            this.personalDetailsForm?.get('phone')?.value ===
            this.currentUser.phone;
        const roleUnchanged =
            this.personalDetailsForm?.get('role')?.value ===
            this.currentUser.role;

        const dataUnchanged =
            firstNameUnchanged &&
            lastNameUnchanged &&
            phoneUnchanged &&
            roleUnchanged;

        return this.personalDetailsForm.pristine || dataUnchanged;
    }

    //#region Image Upload

    async uploadProfilePicture(event) {
        const file = event.target.files[0];

        if (!file || !this.currentUser) {
            return;
        }

        const downloadUrl = await this.userService.uploadProfilePicture(
            this.currentUser.uid!,
            file,
        );

        // Update the current user with profile image url
        this.userService
            .updateUserById(this.currentUser.uid!, {
                ...this.currentUser,
                profilePictureUrl: downloadUrl,
            })
            .subscribe({
                next: (res) => {
                    this.notificationService.open(
                        'Image Uploaded Successfully!',
                        undefined,
                        {
                            duration: 3000,
                        },
                    );
                    this.currentUser = res.user;
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
