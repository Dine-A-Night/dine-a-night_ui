import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
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
        private authService: AuthService,
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

        this.credentialsForm.valueChanges.subscribe(() => {
            console.log(this.credentialsForm.value);
        });
    }

    test() {
        console.log(this.personalDetailsForm.valid);
        console.log(this.personalDetailsForm.value);
    }

    async onLogin() {
        // try {
        //     const res = await this.authService.login(
        //         this.loginForm.get('email')?.value,
        //         this.loginForm.get('password')?.value,
        //     );
        //     if (isDefNotNull(res.user)) {
        //         this.router.navigate(['home']);
        //         this.openSnackBar(
        //             `Successfully logged in as ${res.user?.displayName}`,
        //             'Ok',
        //         );
        //     } else {
        //         this.openSnackBar(
        //             `Incorrect Credentials/User not found`,
        //             'Try Again!',
        //         );
        //     }
        //     console.log(res);
        // } catch (err: any) {
        //     this.openSnackBar('Invalid Credentials', 'Oops');
        // }
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
