import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { isDefNotNull } from 'src/app/utils/helper-functions';

@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    hidePassword: boolean = true;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private _snackBar: MatSnackBar,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });
    }

    async onLogin() {
        try {
            const res = await this.authService.login(
                this.loginForm.get('email')?.value,
                this.loginForm.get('password')?.value,
            );

            if (isDefNotNull(res.user)) {
                this.router.navigate(['home']);
                this.openSnackBar(
                    `Successfully logged in as ${res.user?.displayName}`,
                    'Ok',
                    'success-snackbar',
                );
            } else {
                this.openSnackBar(
                    `Incorrect Credentials/User not found`,
                    'Try Again!',
                    'fail-snackbar',
                );
            }
        } catch (err: any) {
            this.openSnackBar('Invalid Credentials', 'Oops', 'fail-snackbar');
        }
    }
    openSnackBar(
        message: string,
        action: string,
        panelClass = 'info-snackbar',
    ) {
        this._snackBar.open(message, action, {
            duration: 5000,
            panelClass: [panelClass],
        });
    }

    get loginDisabled() {
        return this.loginForm?.invalid;
    }
}
