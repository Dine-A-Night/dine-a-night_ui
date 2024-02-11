import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { ProfileUser } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
    personalDetailsForm: FormGroup;
    credentialsForm: FormGroup;

    stepperOrientation: Observable<StepperOrientation>;

    constructor(
        private userService: UserService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
        breakpointObserver: BreakpointObserver,
    ) {
        this.stepperOrientation = breakpointObserver
            .observe('(min-width: 800px)')
            .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
    }

    ngOnInit(): void {
        this.initForms();
    }

    private initForms() {
        this.personalDetailsForm = this.fb.group({
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            phone: [
                null,
                [
                    Validators.required,
                    Validators.pattern(/^\d*$/),
                    Validators.maxLength(10),
                    Validators.minLength(10),
                ],
            ],
            role: [null, [Validators.required]],
        });

        this.credentialsForm = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
        });
    }

    async onRegister() {
        try {
            const newUser = new ProfileUser({
                firstName: this.personalDetailsForm.value.firstName,
                lastName: this.personalDetailsForm.value.lastName,
                phone: this.personalDetailsForm.value.phone,
                role: this.personalDetailsForm.value.role,
            });
            const res = await this.userService.register(
                this.credentialsForm.get('email')?.value,
                this.credentialsForm.get('password')?.value,
                newUser,
            );
            if (isDefNotNull(res.user)) {
                this.router.navigate(['home']);
                this.openSnackBar(
                    `Successfully created user ${res.user?.displayName}`,
                    'Ok',
                );
            } else {
                this.openSnackBar(`Couldn't create the user!`, 'Try Again!');
            }
        } catch (err: any) {
            console.error(err);
            this.openSnackBar(`Couldn't create the user!`, 'Try Again!');
        }
    }

    openSnackBar(message: string, action: string) {
        this._snackBar.open(message, action, {
            duration: 5000,
        });
    }

    get registerDisabled() {
        return (
            this.personalDetailsForm?.invalid || this.credentialsForm.invalid
        );
    }
}
