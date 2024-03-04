import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ProfileUser, UserRole } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';

export function roleGuard(
    roleName: UserRole,
    redirectUrl: string,
): CanActivateFn {
    return async () => {
        const userService = inject(UserService);
        const router = inject(Router);
        const notificationService = inject(MatSnackBar);

        const currentUser: ProfileUser = await firstValueFrom(
            userService.currentUser$,
        );

        const accessApproved = currentUser.role === roleName;

        if (!accessApproved) {
            router.navigateByUrl(redirectUrl);
            notificationService.open(
                `Only ${roleName}s are authorized to access the feature!`,
                'Ok',
            );
        }

        return accessApproved;
    };
}
