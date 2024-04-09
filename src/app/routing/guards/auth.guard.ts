import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(MatSnackBar);

    const isLoggedIn = await firstValueFrom(authService.isLoggedIn());

    if (!isLoggedIn) {
        router.navigate(['/login']);
        notificationService.open(
            'You need to sign-in to access this feature',
            'Ok',
            {
                panelClass: ['info-snackbar'],
            },
        );
    }

    return isLoggedIn;
};
