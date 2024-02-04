import { Component, OnInit, inject } from '@angular/core';
import { user } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'user-management-page',
    templateUrl: './user-management-page.component.html',
    styleUrls: ['./user-management-page.component.scss'],
})
export class UserManagementPageComponent implements OnInit {
    userService = inject(UserService);
    authService = inject(AuthService);
    afAuth = inject(AngularFireAuth);
    fb = inject(FormBuilder);

    currentUser: ProfileUser;

    personalDetailsForm: FormGroup;

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
}
