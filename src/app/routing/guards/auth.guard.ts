import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

export const authGuard: CanActivateFn = async () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const isLoggedIn = await firstValueFrom(authService.isLoggedIn());

    if (!isLoggedIn) {
        router.navigate(['/login']);
    }

    return isLoggedIn;
};
